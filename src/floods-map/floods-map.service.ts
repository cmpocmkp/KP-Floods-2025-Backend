import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DateRangeDto } from './dtos/date-range.dto';
import { TrendParamsDto, TrendMetric } from './dtos/trend-params.dto';
import { GeoJsonResponse, OverviewResponse, TrendResponse, DivisionSummaryResponse, DistrictSummaryResponse, TrendPoint, DistrictFeature } from './interfaces/gis.interface';
import { ChoroplethData, Coordinates } from './interfaces/additional.interface';
import { ChoroplethParams, ChoroplethMetric } from './dtos/choropleth-params.dto';
import { RecentIncidentsParams } from './dtos/incidents-params.dto';
import {
  IncidentRecord,
  InfrastructureStatus,
  DistrictInfrastructure,
  WarehouseStockByDivision,
  WarehouseItemsDaily,
  WarehouseTopItem,
  CampsSummary,
  CampsByDistrict,
  CampsFacilities,
  CompensationSummary,
  CompensationDaily,
  CompensationByDistrict,
} from './interfaces/additional-endpoints.interface';
import * as LRU from 'lru-cache';

@Injectable()
export class FloodsMapService {
  private cache: LRU<string, any>;

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    // Initialize LRU cache with 60s TTL
    this.cache = new LRU({
      max: 500, // Store max 500 items
      ttl: 1000 * 60, // 60 seconds
    });
  }

  private normalizeDistrict(district: string): string {
    return district?.trim().toLowerCase() ?? '';
  }

  private getDateRange(params: DateRangeDto): { from: Date; to: Date } {
    const to = params.date_to ? new Date(params.date_to) : new Date();
    let from = params.date_from ? new Date(params.date_from) : new Date(to);
    
    if (!params.date_from) {
      // Default to last 7 days if not specified
      from.setDate(to.getDate() - 7);
    }

    // Validate dates
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
    }

    if (from > to) {
      throw new BadRequestException('date_from must be before or equal to date_to');
    }

    return { from, to };
  }

  private async getDistrictDivisionMap(): Promise<Map<string, string>> {
    // Get division mapping from any floods table that has it
    const results = await this.dataSource
      .createQueryBuilder()
      .select('DISTINCT LOWER(TRIM(district))', 'district')
      .addSelect('division', 'division')
      .from('floods.human_losses', 'hl')
      .where('division IS NOT NULL')
      .getRawMany();

    const map = new Map<string, string>();
    for (const row of results) {
      map.set(row.district, row.division);
    }
    return map;
  }

  private async getLatestIncidentsPerDistrict(from: Date, to: Date) {
    return this.dataSource.query(`
      WITH latest_inc AS (
        SELECT DISTINCT ON (district, report_date)
          district, report_date, total_deaths, total_injured, total_houses_damaged, total_other_damaged
        FROM dmis.district_incidents_reported
        WHERE report_date BETWEEN $1 AND $2
        ORDER BY district, report_date DESC
      ),
      agg_inc AS (
        SELECT
          lower(trim(district)) AS district,
          MAX(report_date) AS latest_report_date,
          SUM(total_deaths) AS deaths,
          SUM(total_injured) AS injured,
          SUM(total_houses_damaged) AS houses_damaged
        FROM latest_inc
        GROUP BY lower(trim(district))
      )
      SELECT * FROM agg_inc
    `, [from.toISOString(), to.toISOString()]);
  }

  private async getSchoolDamages(from: Date, to: Date) {
    return this.dataSource
      .createQueryBuilder()
      .select('LOWER(TRIM(district))', 'district')
      .addSelect('COUNT(DISTINCT id)', 'schools_damaged')
      .from('floods.esed_school_damages', 'esd')
      .where('report_date BETWEEN :from AND :to', { from, to })
      .groupBy('LOWER(TRIM(district))')
      .getRawMany();
  }

  private async getLivestockLosses(from: Date, to: Date) {
    return this.dataSource
      .createQueryBuilder()
      .select('LOWER(TRIM(district))', 'district')
      .addSelect('SUM(cattles_perished)', 'livestock_lost')
      .from('floods.livestock_losses', 'll')
      .where('report_date BETWEEN :from AND :to', { from, to })
      .groupBy('LOWER(TRIM(district))')
      .getRawMany();
  }

  private async getCnwDamages(from: Date, to: Date) {
    return this.dataSource
      .createQueryBuilder()
      .select('LOWER(TRIM(district))', 'district')
      .addSelect('SUM(COALESCE(road_damage_length_km, 0))', 'roads_damaged_km')
      .addSelect('SUM(COALESCE(bridges_damaged_count, 0))', 'bridges_damaged')
      .addSelect('SUM(COALESCE(culverts_damage_count, 0))', 'culverts_damaged')
      .from('floods.cnw_assets', 'cnw')
      .where('report_date BETWEEN :from AND :to', { from, to })
      .groupBy('LOWER(TRIM(district))')
      .getRawMany();
  }

  async getDistrictsGeoJson(params: DateRangeDto): Promise<GeoJsonResponse> {
    const cacheKey = `districts_geojson_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const { from, to } = this.getDateRange(params);

    // Get coordinates
    const coordinates = await this.dataSource
      .createQueryBuilder()
      .select('district', 'district')
      .addSelect('latitude', 'latitude')
      .addSelect('longitude', 'longitude')
      .from('floods.affected_district_coordinates', 'coords')
      .getRawMany();

    // Get metrics
    const incidents = await this.getLatestIncidentsPerDistrict(from, to);
    const schoolDamages = await this.getSchoolDamages(from, to);
    const livestockLosses = await this.getLivestockLosses(from, to);
    const cnwDamages = await this.getCnwDamages(from, to);

    // Create feature collection
    const features: DistrictFeature[] = coordinates.map(coord => {
      const incident = incidents.find(i => this.normalizeDistrict(i.district) === this.normalizeDistrict(coord.district)) || {};
      const schools = schoolDamages.find(s => this.normalizeDistrict(s.district) === this.normalizeDistrict(coord.district)) || {};
      const livestock = livestockLosses.find(l => this.normalizeDistrict(l.district) === this.normalizeDistrict(coord.district)) || {};
      const cnw = cnwDamages.find(c => this.normalizeDistrict(c.district) === this.normalizeDistrict(coord.district)) || {};

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [coord.longitude, coord.latitude]
        },
        properties: {
          district: coord.district,
          latest_report_date: incident.latest_report_date || null,
          deaths: incident.deaths || 0,
          injured: incident.injured || 0,
          houses_damaged: incident.houses_damaged || 0,
          schools_damaged: schools.schools_damaged || 0,
          livestock_lost: livestock.livestock_lost || 0,
          roads_damaged_km: cnw.roads_damaged_km || 0,
          bridges_damaged: cnw.bridges_damaged || 0,
          culverts_damaged: cnw.culverts_damaged || 0
        }
      };
    });

    const response: GeoJsonResponse = {
      type: 'FeatureCollection',
      features
    };

    this.cache.set(cacheKey, response);
    return response;
  }

  async getChoroplethData(params: ChoroplethParams): Promise<ChoroplethData[]> {
    const cacheKey = `choropleth_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const { from, to } = this.getDateRange(params);
    let result: any[];

    switch (params.metric) {
      case 'deaths':
      case 'injured':
      case 'houses':
        const incidents = await this.getLatestIncidentsPerDistrict(from, to);
        result = incidents.map(i => ({
          district: i.district,
          value: i[params.metric === 'houses' ? 'houses_damaged' : params.metric] || 0
        }));
        break;

      case 'livestock':
        const livestock = await this.getLivestockLosses(from, to);
        result = livestock.map(l => ({
          district: l.district,
          value: l.livestock_lost || 0
        }));
        break;

      default:
        throw new BadRequestException('Invalid metric');
    }

    this.cache.set(cacheKey, result);
    return result;
  }

  async getDistrictCoordinates(): Promise<Coordinates[]> {
    const cacheKey = 'district_coordinates';
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const result = await this.dataSource
      .createQueryBuilder()
      .select('district', 'district')
      .addSelect('latitude', 'latitude')
      .addSelect('longitude', 'longitude')
      .from('floods.affected_district_coordinates', 'coords')
      .getRawMany();

    this.cache.set(cacheKey, result);
    return result;
  }

  async getDistrictsTopoJson(): Promise<any> {
    const cacheKey = 'districts_topojson';
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    // This would typically be a static TopoJSON file served from the filesystem
    // For now, we'll return a simplified version with just the district boundaries
    const result = {
      type: "Topology",
      objects: {
        districts: {
          type: "GeometryCollection",
          geometries: []
        }
      },
      arcs: []
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  async getRecentIncidents(params: RecentIncidentsParams): Promise<IncidentRecord[]> {
    const cacheKey = `recent_incidents_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const { from, to } = this.getDateRange(params);
    const limit = params.limit || 20;
    const districtFilter = params.district ? `AND LOWER(TRIM(district)) = LOWER(TRIM($3))` : '';

    const result = await this.dataSource.query(`
      SELECT
        report_date as date,
        total_deaths as deaths,
        total_injured as injured,
        total_houses_damaged as houses_damaged
      FROM dmis.district_incidents_reported
      WHERE report_date BETWEEN $1 AND $2
      ${districtFilter}
      ORDER BY report_date DESC
      LIMIT $4
    `, [from.toISOString(), to.toISOString(), params.district, limit]);

    this.cache.set(cacheKey, result);
    return result;
  }

  async getDistrictIncidents(district: string, params: DateRangeDto): Promise<IncidentRecord[]> {
    const cacheKey = `district_incidents_${district}_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const { from, to } = this.getDateRange(params);
    const normalizedDistrict = this.normalizeDistrict(district);

    const result = await this.dataSource.query(`
      SELECT
        report_date as date,
        total_deaths as deaths,
        total_injured as injured,
        total_houses_damaged as houses_damaged
      FROM dmis.district_incidents_reported
      WHERE report_date BETWEEN $1 AND $2
        AND LOWER(TRIM(district)) = $3
      ORDER BY report_date DESC
    `, [from.toISOString(), to.toISOString(), normalizedDistrict]);

    this.cache.set(cacheKey, result);
    return result;
  }

  async getInfrastructureStatus(params: DateRangeDto): Promise<InfrastructureStatus> {
    const cacheKey = `infrastructure_status_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const { from, to } = this.getDateRange(params);

    const result = await this.dataSource.query(`
      SELECT
        SUM(CASE WHEN restoration_status = 'fully_restored' THEN COALESCE(road_damage_length_km, 0) ELSE 0 END) as roads_fully,
        SUM(CASE WHEN restoration_status = 'partially_restored' THEN COALESCE(road_damage_length_km, 0) ELSE 0 END) as roads_partial,
        SUM(CASE WHEN restoration_status = 'not_restored' THEN COALESCE(road_damage_length_km, 0) ELSE 0 END) as roads_none,
        SUM(CASE WHEN restoration_status = 'fully_restored' THEN COALESCE(bridges_damaged_count, 0) ELSE 0 END) as bridges_fully,
        SUM(CASE WHEN restoration_status = 'partially_restored' THEN COALESCE(bridges_damaged_count, 0) ELSE 0 END) as bridges_partial,
        SUM(CASE WHEN restoration_status = 'not_restored' THEN COALESCE(bridges_damaged_count, 0) ELSE 0 END) as bridges_none,
        SUM(CASE WHEN restoration_status = 'fully_restored' THEN COALESCE(culverts_damage_count, 0) ELSE 0 END) as culverts_fully,
        SUM(CASE WHEN restoration_status = 'partially_restored' THEN COALESCE(culverts_damage_count, 0) ELSE 0 END) as culverts_partial,
        SUM(CASE WHEN restoration_status = 'not_restored' THEN COALESCE(culverts_damage_count, 0) ELSE 0 END) as culverts_none
      FROM floods.cnw_assets
      WHERE report_date BETWEEN $1 AND $2
    `, [from.toISOString(), to.toISOString()]);

    const response: InfrastructureStatus = {
      roads_km: {
        fully_restored: result[0].roads_fully || 0,
        partially_restored: result[0].roads_partial || 0,
        not_restored: result[0].roads_none || 0,
      },
      bridges: {
        fully_restored: result[0].bridges_fully || 0,
        partially_restored: result[0].bridges_partial || 0,
        not_restored: result[0].bridges_none || 0,
      },
      culverts: {
        fully_restored: result[0].culverts_fully || 0,
        partially_restored: result[0].culverts_partial || 0,
        not_restored: result[0].culverts_none || 0,
      },
    };

    this.cache.set(cacheKey, response);
    return response;
  }

  async getInfrastructureByDistrict(params: DateRangeDto): Promise<DistrictInfrastructure[]> {
    const cacheKey = `infrastructure_by_district_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const { from, to } = this.getDateRange(params);

    const result = await this.dataSource.query(`
      SELECT
        LOWER(TRIM(district)) as district,
        SUM(COALESCE(road_damage_length_km, 0)) as roads_km,
        SUM(COALESCE(bridges_damaged_count, 0)) as bridges,
        SUM(COALESCE(culverts_damage_count, 0)) as culverts,
        COALESCE(
          SUM(CASE WHEN restoration_status IN ('fully_restored', 'partially_restored') THEN 1 ELSE 0 END)::float /
          NULLIF(COUNT(*), 0),
          0
        ) as restoration_progress
      FROM floods.cnw_assets
      WHERE report_date BETWEEN $1 AND $2
      GROUP BY LOWER(TRIM(district))
      ORDER BY district
    `, [from.toISOString(), to.toISOString()]);

    this.cache.set(cacheKey, result);
    return result;
  }

  async getWarehouseStockByDivision(params: DateRangeDto): Promise<WarehouseStockByDivision[]> {
    const cacheKey = `warehouse_stock_by_division_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const { from, to } = this.getDateRange(params);

    const result = await this.dataSource.query(`
      SELECT
        division,
        SUM(stock_value) as stock_value
      FROM dmis.warehouse_stock_by_division
      WHERE report_date BETWEEN $1 AND $2
      GROUP BY division
      ORDER BY division
    `, [from.toISOString(), to.toISOString()]);

    this.cache.set(cacheKey, result);
    return result;
  }

  async getWarehouseItemsIssuedDaily(params: DateRangeDto): Promise<WarehouseItemsDaily[]> {
    const cacheKey = `warehouse_items_issued_daily_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const { from, to } = this.getDateRange(params);

    const result = await this.dataSource.query(`
      SELECT
        report_date as date,
        COUNT(*) as items_issued
      FROM dmis.warehouse_item_issued
      WHERE report_date BETWEEN $1 AND $2
      GROUP BY report_date
      ORDER BY report_date
    `, [from.toISOString(), to.toISOString()]);

    this.cache.set(cacheKey, result);
    return result;
  }

  async getWarehouseTopItems(limit: number = 20): Promise<WarehouseTopItem[]> {
    const cacheKey = `warehouse_top_items_${limit}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const result = await this.dataSource.query(`
      WITH item_stats AS (
        SELECT
          i.item_name,
          SUM(i.quantity) as available,
          COALESCE(SUM(issued.quantity), 0) as issued
        FROM dmis.warehouse_stock_items i
        LEFT JOIN dmis.warehouse_item_issued issued ON i.item_name = issued.item_name
        GROUP BY i.item_name
      )
      SELECT
        item_name as item,
        available,
        issued,
        (available - issued) as remaining,
        CASE
          WHEN (available - issued) > available * 0.5 THEN 'In Stock'
          WHEN (available - issued) > 0 THEN 'Low Stock'
          ELSE 'Out of Stock'
        END as status
      FROM item_stats
      ORDER BY available DESC
      LIMIT $1
    `, [limit]);

    this.cache.set(cacheKey, result);
    return result;
  }

  async getCampsSummary(params: DateRangeDto): Promise<CampsSummary> {
    const cacheKey = `camps_summary_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const { from, to } = this.getDateRange(params);

    const result = await this.dataSource.query(`
      SELECT
        COUNT(DISTINCT id) as total_camps,
        COUNT(DISTINCT district) as districts_with_camps,
        SUM(current_occupants) as total_occupants,
        COALESCE(
          SUM(current_occupants)::float / NULLIF(SUM(total_capacity), 0),
          0
        ) as capacity_utilization
      FROM dmis.camps_snapshot
      WHERE report_date BETWEEN $1 AND $2
    `, [from.toISOString(), to.toISOString()]);

    const response: CampsSummary = {
      total_camps: result[0].total_camps || 0,
      districts_with_camps: result[0].districts_with_camps || 0,
      total_occupants: result[0].total_occupants || 0,
      capacity_utilization: result[0].capacity_utilization || 0,
    };

    this.cache.set(cacheKey, response);
    return response;
  }

  async getCampsByDistrict(params: DateRangeDto): Promise<CampsByDistrict[]> {
    const cacheKey = `camps_by_district_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const { from, to } = this.getDateRange(params);

    const result = await this.dataSource.query(`
      SELECT
        district,
        COUNT(DISTINCT id) as camps_count,
        SUM(current_occupants) as occupants,
        SUM(total_capacity) as capacity,
        COALESCE(
          SUM(current_occupants)::float / NULLIF(SUM(total_capacity), 0),
          0
        ) as utilization
      FROM dmis.camps_snapshot
      WHERE report_date BETWEEN $1 AND $2
      GROUP BY district
      ORDER BY district
    `, [from.toISOString(), to.toISOString()]);

    this.cache.set(cacheKey, result);
    return result;
  }

  async getCampsFacilities(params: DateRangeDto): Promise<CampsFacilities> {
    const cacheKey = `camps_facilities_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const { from, to } = this.getDateRange(params);

    const result = await this.dataSource.query(`
      SELECT
        COALESCE(AVG(CASE WHEN has_medical_facilities THEN 1 ELSE 0 END), 0) as medical,
        COALESCE(AVG(CASE WHEN has_water_supply THEN 1 ELSE 0 END), 0) as water,
        COALESCE(AVG(CASE WHEN has_sanitation THEN 1 ELSE 0 END), 0) as sanitation,
        COALESCE(AVG(CASE WHEN has_electricity THEN 1 ELSE 0 END), 0) as electricity,
        COALESCE(AVG(CASE WHEN has_shelter THEN 1 ELSE 0 END), 0) as shelter
      FROM dmis.camps_snapshot
      WHERE report_date BETWEEN $1 AND $2
    `, [from.toISOString(), to.toISOString()]);

    const response: CampsFacilities = {
      medical: result[0].medical || 0,
      water: result[0].water || 0,
      sanitation: result[0].sanitation || 0,
      electricity: result[0].electricity || 0,
      shelter: result[0].shelter || 0,
    };

    this.cache.set(cacheKey, response);
    return response;
  }

  // Stub implementations for compensation endpoints
  async getCompensationSummary(params: DateRangeDto): Promise<CompensationSummary> {
    return {
      total_disbursed: 0,
      total_beneficiaries: 0,
      average_per_beneficiary: 0,
    };
  }

  async getCompensationDaily(params: DateRangeDto): Promise<CompensationDaily[]> {
    return [];
  }

  async getCompensationByDistrict(params: DateRangeDto): Promise<CompensationByDistrict[]> {
    return [];
  }
}