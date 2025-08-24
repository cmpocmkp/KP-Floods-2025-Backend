import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistrictIncidentsReported } from '../../dmis/entities/district-incidents-reported.entity';
import { LivestockLosses } from '../../floods/entities/livestock-losses.entity';
import { DamageDistributionResponse, DamageDistributionBucket } from '../interfaces/distribution.interface';
import { withCache, getCacheKey } from '../../common/cache.util';

@Injectable()
export class DistributionService {
  constructor(
    @InjectRepository(DistrictIncidentsReported)
    private districtIncidentsRepo: Repository<DistrictIncidentsReported>,
    @InjectRepository(LivestockLosses)
    private livestockLossesRepo: Repository<LivestockLosses>,
  ) {}

  async getDamageDistribution(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<DamageDistributionResponse> {
    const today = new Date();
    const defaultDateTo = today.toISOString().split('T')[0];
    const defaultDateFrom = new Date(today.setDate(today.getDate() - 7))
      .toISOString()
      .split('T')[0];

    const from = dateFrom || defaultDateFrom;
    const to = dateTo || defaultDateTo;

    const cacheKey = getCacheKey('/api/distribution/damage', {
      date_from: from,
      date_to: to,
    });

    return withCache(cacheKey, async () => {
      // Get incidents data
      const incidentsQuery = this.districtIncidentsRepo
        .createQueryBuilder('dir')
        .select([
          'SUM(dir.total_deaths) as deaths',
          'SUM(dir.total_injured) as injured',
          'SUM(dir.total_houses_damaged) as houses_damaged',
        ])
        .where('dir.report_date BETWEEN :from AND :to', { from, to });

      const incidentsResult = await incidentsQuery.getRawOne();

      // Get livestock data
      const livestockQuery = this.livestockLossesRepo
        .createQueryBuilder('ll')
        .select('SUM(ll.cattles_perished) as livestock_lost')
        .where('ll.created_at BETWEEN :from AND :to', { from, to });

      const livestockResult = await livestockQuery.getRawOne();

      const buckets: DamageDistributionBucket[] = [
        { key: 'deaths', value: parseInt(incidentsResult.deaths) || 0 },
        { key: 'injured', value: parseInt(incidentsResult.injured) || 0 },
        {
          key: 'houses_damaged',
          value: parseInt(incidentsResult.houses_damaged) || 0,
        },
        {
          key: 'livestock_lost',
          value: parseInt(livestockResult.livestock_lost) || 0,
        },
      ];

      const total_incidents = buckets.reduce((sum, bucket) => sum + bucket.value, 0);

      return {
        total_incidents,
        buckets,
      };
    });
  }
}