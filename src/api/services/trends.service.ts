import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistrictCasualtiesTrendDaily } from '../../dmis/entities/district-casualties-trend-daily.entity';
import { DistrictIncidentsReported } from '../../dmis/entities/district-incidents-reported.entity';
import { TrendMetric, GroupBy } from '../dtos/trends.dto';
import { alignAndFill } from '../utils/date.util';
import { withCache, getCacheKey } from '../../common/cache.util';

interface TrendPoint {
  date: string;
  value: number;
}

interface IncidentTrendResponse {
  metric: TrendMetric;
  scope: { district: string } | 'province';
  group_by: GroupBy;
  series: TrendPoint[];
  last_updated: string;
  source: 'dmis.district_casualties_trend_daily';
}

interface MultiDistrictTrend {
  district: string;
  series: TrendPoint[];
}

interface MultiDistrictResponse {
  metric: TrendMetric;
  series: MultiDistrictTrend[];
}

@Injectable()
export class TrendsService {
  constructor(
    @InjectRepository(DistrictCasualtiesTrendDaily)
    private trendDailyRepo: Repository<DistrictCasualtiesTrendDaily>,
    @InjectRepository(DistrictIncidentsReported)
    private incidentsRepo: Repository<DistrictIncidentsReported>,
  ) {}

  private getMetricColumn(metric: TrendMetric): string {
    switch (metric) {
      case TrendMetric.DEATHS:
        return 'total_deaths';
      case TrendMetric.INJURED:
        return 'total_injured';
      case TrendMetric.HOUSES:
        return 'total_houses_damaged';
    }
  }

  async getIncidentTrend(
    metric: TrendMetric,
    dateFrom: string,
    dateTo: string,
    district?: string,
    groupBy: GroupBy = GroupBy.DAILY,
    fillMissing = true,
  ): Promise<IncidentTrendResponse> {
    const cacheKey = getCacheKey('/api/trends/incidents', {
      metric,
      date_from: dateFrom,
      date_to: dateTo,
      district,
      group_by: groupBy,
      fill_missing: fillMissing,
    });

    return withCache(cacheKey, async () => {
      const column = this.getMetricColumn(metric);
      let query = this.trendDailyRepo.createQueryBuilder('trend');

      if (groupBy === GroupBy.WEEKLY) {
        query = query
          .select([
            "to_char(date_trunc('week', trend.report_date), 'YYYY-MM-DD') AS date",
            `SUM(trend.${column}) AS value`,
            'MAX(trend.created_at) as last_updated',
          ])
          .groupBy("date_trunc('week', trend.report_date)");
      } else {
        query = query
          .select([
            'trend.report_date::date AS date',
            `SUM(trend.${column}) AS value`,
            'MAX(trend.created_at) as last_updated',
          ])
          .groupBy('trend.report_date::date');
      }

      if (district) {
        query = query.andWhere('LOWER(TRIM(trend.district)) = LOWER(TRIM(:district))', {
          district,
        });
      }

      query = query
        .andWhere('trend.report_date BETWEEN :from AND :to', {
          from: dateFrom,
          to: dateTo,
        })
        .orderBy('date', 'ASC');

      const results = await query.getRawMany();
      const seriesMap = new Map(
        results.map((r) => [r.date, parseInt(r.value) || 0]),
      );

      const series = alignAndFill(seriesMap, dateFrom, dateTo, groupBy, fillMissing);
      const lastUpdated = results
        .map((r) => r.last_updated)
        .filter(Boolean)
        .sort()
        .pop();

      return {
        metric,
        scope: district ? { district } : 'province',
        group_by: groupBy,
        series,
        last_updated: lastUpdated,
        source: 'dmis.district_casualties_trend_daily',
      };
    });
  }

  async getMultiDistrictTrend(
    metric: TrendMetric,
    dateFrom: string,
    dateTo: string,
    topN = 8,
  ): Promise<MultiDistrictResponse> {
    const cacheKey = getCacheKey('/api/trends/incidents/by-district', {
      metric,
      date_from: dateFrom,
      date_to: dateTo,
      top: topN,
    });

    return withCache(cacheKey, async () => {
      const column = this.getMetricColumn(metric);

      // First get top N districts by total value
      const topDistrictsQuery = this.trendDailyRepo
        .createQueryBuilder('trend')
        .select([
          'trend.district',
          `SUM(trend.${column}) as total`,
        ])
        .where('trend.report_date BETWEEN :from AND :to', {
          from: dateFrom,
          to: dateTo,
        })
        .groupBy('trend.district')
        .orderBy('total', 'DESC')
        .limit(topN);

      const topDistricts = await topDistrictsQuery.getRawMany();

      // Then get daily series for each top district
      const districtPromises = topDistricts.map(async (d) => {
        const series = await this.getIncidentTrend(
          metric,
          dateFrom,
          dateTo,
          d.district,
          GroupBy.DAILY,
          true,
        );
        return {
          district: d.district,
          series: series.series,
        };
      });

      const series = await Promise.all(districtPromises);

      return {
        metric,
        series,
      };
    });
  }
}