import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistrictIncidentsReported } from '../../dmis/entities/district-incidents-reported.entity';
import { EsedSchoolDamages } from '../../floods/entities/esed-school-damages.entity';
import { LivestockLosses } from '../../floods/entities/livestock-losses.entity';
import { OverviewResponse } from '../interfaces/overview.interface';
import { withCache, getCacheKey } from '../../common/cache.util';

@Injectable()
export class OverviewService {
  constructor(
    @InjectRepository(DistrictIncidentsReported)
    private districtIncidentsRepo: Repository<DistrictIncidentsReported>,
    @InjectRepository(EsedSchoolDamages)
    private schoolDamagesRepo: Repository<EsedSchoolDamages>,
    @InjectRepository(LivestockLosses)
    private livestockLossesRepo: Repository<LivestockLosses>,
  ) {}

  async getOverview(dateFrom?: string, dateTo?: string): Promise<OverviewResponse> {
    const today = new Date();
    const defaultDateTo = today.toISOString().split('T')[0];
    const defaultDateFrom = new Date(today.setDate(today.getDate() - 7))
      .toISOString()
      .split('T')[0];

    const from = dateFrom || defaultDateFrom;
    const to = dateTo || defaultDateTo;

    const cacheKey = getCacheKey('/api/overview', { date_from: from, date_to: to });

    return withCache(cacheKey, async () => {
      // Get incidents data
      const incidentsQuery = this.districtIncidentsRepo
        .createQueryBuilder('dir')
        .select([
          'SUM(dir.total_deaths) as deaths',
          'SUM(dir.total_injured) as injured',
          'SUM(dir.total_houses_damaged) as houses_damaged',
          'MAX(dir.created_at) as incidents_updated',
        ])
        .where('dir.report_date BETWEEN :from AND :to', { from, to });

      const incidentsResult = await incidentsQuery.getRawOne();

      // Get schools data
      const schoolsQuery = this.schoolDamagesRepo
        .createQueryBuilder('esd')
        .select([
          'COUNT(*) as schools_damaged',
          'MAX(esd.created_at) as schools_updated',
        ])
        .where('esd.created_at <= :to', { to });

      const schoolsResult = await schoolsQuery.getRawOne();

      // Get livestock data
      const livestockQuery = this.livestockLossesRepo
        .createQueryBuilder('ll')
        .select([
          'SUM(ll.cattles_perished) as livestock_lost',
          'MAX(ll.created_at) as livestock_updated',
        ])
        .where('ll.created_at BETWEEN :from AND :to', { from, to });

      const livestockResult = await livestockQuery.getRawOne();

      // Calculate last updated
      const lastUpdated = [
        incidentsResult.incidents_updated,
        schoolsResult.schools_updated,
        livestockResult.livestock_updated,
      ]
        .filter(Boolean)
        .sort()
        .pop();

      return {
        report_period: { from, to },
        totals: {
          deaths: parseInt(incidentsResult.deaths) || 0,
          injured: parseInt(incidentsResult.injured) || 0,
          houses_damaged: parseInt(incidentsResult.houses_damaged) || 0,
          schools_damaged: parseInt(schoolsResult.schools_damaged) || 0,
          livestock_lost: parseInt(livestockResult.livestock_lost) || 0,
        },
        last_updated: lastUpdated,
        sources: [
          'dmis.district_incidents_reported',
          'floods.esed_school_damages',
          'floods.livestock_losses',
        ],
      };
    });
  }
}