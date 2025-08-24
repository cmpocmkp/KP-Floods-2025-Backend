import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistrictIncidentsReported } from '../../dmis/entities/district-incidents-reported.entity';
import { EsedSchoolDamages } from '../../floods/entities/esed-school-damages.entity';
import { LivestockLosses } from '../../floods/entities/livestock-losses.entity';
import { DivisionSummaryResponse, DivisionRow } from '../interfaces/summaries.interface';
import { withCache, getCacheKey } from '../../common/cache.util';
import { getDistrictDivision } from '../../common/districtDivisionMap';

@Injectable()
export class SummariesService {
  constructor(
    @InjectRepository(DistrictIncidentsReported)
    private districtIncidentsRepo: Repository<DistrictIncidentsReported>,
    @InjectRepository(EsedSchoolDamages)
    private schoolDamagesRepo: Repository<EsedSchoolDamages>,
    @InjectRepository(LivestockLosses)
    private livestockLossesRepo: Repository<LivestockLosses>,
  ) {}

  async getDivisionSummary(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<DivisionSummaryResponse> {
    try {
      const today = new Date();
      const defaultDateTo = today.toISOString().split('T')[0];
      const defaultDateFrom = new Date(today.setDate(today.getDate() - 7))
        .toISOString()
        .split('T')[0];

      const from = dateFrom || defaultDateFrom;
      const to = dateTo || defaultDateTo;

      // Validate date range
      if (new Date(from) > new Date(to)) {
        throw new Error('date_from cannot be later than date_to');
      }

      const cacheKey = getCacheKey('/api/summaries/divisions', {
        date_from: from,
        date_to: to,
      });

      return withCache(cacheKey, async () => {
        try {
          console.log('Starting to fetch division summary data...');
          console.log('Date range:', { from, to });

      // Get incidents data by district
      const incidentsQuery = this.districtIncidentsRepo
        .createQueryBuilder('dir')
        .select([
          'dir.district',
          'SUM(dir.total_deaths) as deaths',
          'SUM(dir.total_injured) as injured',
          'SUM(dir.total_houses_damaged) as houses_damaged',
          'MAX(dir.created_at) as incidents_updated',
        ])
        .where('dir.report_date BETWEEN :from AND :to', { from, to })
        .groupBy('dir.district');

      // Log the raw SQL query
      const [rawSql, parameters] = incidentsQuery.getQueryAndParameters();
      console.log('Incidents Query SQL:', rawSql);
      console.log('Query Parameters:', parameters);
      
      console.log('Executing incidents query...');

      const incidentsResults = await incidentsQuery.getRawMany();
      console.log('Incidents data fetched:', { count: incidentsResults.length });

      // Get schools data by district
      console.log('Executing schools query...');
      const schoolsQuery = this.schoolDamagesRepo
        .createQueryBuilder('esd')
        .select([
          'esd.district',
          'COUNT(*) as schools_damaged',
          'MAX(esd.created_at) as schools_updated',
        ])
        .where('esd.created_at <= :to', { to })
        .groupBy('esd.district');

      const schoolsResults = await schoolsQuery.getRawMany();
      console.log('Schools data fetched:', { count: schoolsResults.length });

      // Get livestock data by district
      console.log('Executing livestock query...');
      const livestockQuery = this.livestockLossesRepo
        .createQueryBuilder('ll')
        .select([
          'll.district',
          'SUM(ll.cattles_perished) as livestock_lost',
          'MAX(ll.created_at) as livestock_updated',
        ])
        .where('ll.created_at BETWEEN :from AND :to', { from, to })
        .groupBy('ll.district');

      const livestockResults = await livestockQuery.getRawMany();
      console.log('Livestock data fetched:', { count: livestockResults.length });

      // Create division map for aggregation
      console.log('Processing data and creating division map...');
      const divisionMap = new Map<string, DivisionRow>();

      // Process incidents data
      incidentsResults.forEach((incident) => {
        const division = getDistrictDivision(incident.district);
        if (!divisionMap.has(division)) {
          divisionMap.set(division, {
            division,
            deaths: 0,
            injured: 0,
            houses_damaged: 0,
            schools_damaged: 0,
            livestock_lost: 0,
          });
        }
        const row = divisionMap.get(division)!;
        row.deaths += parseInt(incident.deaths) || 0;
        row.injured += parseInt(incident.injured) || 0;
        row.houses_damaged += parseInt(incident.houses_damaged) || 0;
      });

      // Process schools data
      schoolsResults.forEach((school) => {
        const division = getDistrictDivision(school.district);
        if (!divisionMap.has(division)) {
          divisionMap.set(division, {
            division,
            deaths: 0,
            injured: 0,
            houses_damaged: 0,
            schools_damaged: 0,
            livestock_lost: 0,
          });
        }
        const row = divisionMap.get(division)!;
        row.schools_damaged += parseInt(school.schools_damaged) || 0;
      });

      // Process livestock data
      livestockResults.forEach((livestock) => {
        const division = getDistrictDivision(livestock.district);
        if (!divisionMap.has(division)) {
          divisionMap.set(division, {
            division,
            deaths: 0,
            injured: 0,
            houses_damaged: 0,
            schools_damaged: 0,
            livestock_lost: 0,
          });
        }
        const row = divisionMap.get(division)!;
        row.livestock_lost += parseInt(livestock.livestock_lost) || 0;
      });

      // Calculate totals and sort rows
      const rows = Array.from(divisionMap.values()).sort((a, b) =>
        a.division.localeCompare(b.division),
      );

      const totals = rows.reduce(
        (acc, row) => ({
          deaths: acc.deaths + row.deaths,
          injured: acc.injured + row.injured,
          houses_damaged: acc.houses_damaged + row.houses_damaged,
          schools_damaged: acc.schools_damaged + row.schools_damaged,
          livestock_lost: acc.livestock_lost + row.livestock_lost,
        }),
        {
          deaths: 0,
          injured: 0,
          houses_damaged: 0,
          schools_damaged: 0,
          livestock_lost: 0,
        },
      );

      // Calculate last updated
      const lastUpdated = [
        ...incidentsResults.map((r) => r.incidents_updated),
        ...schoolsResults.map((r) => r.schools_updated),
        ...livestockResults.map((r) => r.livestock_updated),
      ]
        .filter(Boolean)
        .sort()
        .pop();

          return {
            rows,
            totals,
            last_updated: lastUpdated,
          };
        } catch (error) {
          console.error('Error in data fetching:', error);
          if (error instanceof Error) {
            console.error('Stack trace:', error.stack);
          }
          throw error;
        }
      });
    } catch (error) {
      console.error('Error in getDivisionSummary:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to get division summary',
      );
    }
  }
}