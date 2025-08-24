import { ApiProperty } from '@nestjs/swagger';

export class GeoPoint {
  @ApiProperty({ example: 'Point' })
  type: 'Point';

  @ApiProperty({
    example: [71.5432, 34.0123],
    description: 'Coordinates in [longitude, latitude] format',
  })
  coordinates: [number, number];
}

export class DistrictFeatureProperties {
  @ApiProperty({ example: 'Buner' })
  district: string;

  @ApiProperty({ example: '2025-08-20' })
  latest_report_date: string;

  @ApiProperty({ example: 12 })
  deaths: number;

  @ApiProperty({ example: 28 })
  injured: number;

  @ApiProperty({ example: 156 })
  houses_damaged: number;

  @ApiProperty({ example: 9 })
  schools_damaged: number;

  @ApiProperty({ example: 23 })
  livestock_lost: number;

  @ApiProperty({ example: 78.5 })
  roads_damaged_km: number;

  @ApiProperty({ example: 5 })
  bridges_damaged: number;

  @ApiProperty({ example: 23 })
  culverts_damaged: number;
}

export class DistrictFeature {
  @ApiProperty({ example: 'Feature' })
  type: 'Feature';

  @ApiProperty({ type: GeoPoint })
  geometry: GeoPoint;

  @ApiProperty({ type: DistrictFeatureProperties })
  properties: DistrictFeatureProperties;
}

export class GeoJsonResponse {
  @ApiProperty({ example: 'FeatureCollection' })
  type: 'FeatureCollection';

  @ApiProperty({ type: [DistrictFeature] })
  features: DistrictFeature[];
}

export class ReportPeriod {
  @ApiProperty({ example: '2025-08-14' })
  from: string;

  @ApiProperty({ example: '2025-08-20' })
  to: string;
}

export class OverviewTotals {
  @ApiProperty({ example: 156 })
  deaths: number;

  @ApiProperty({ example: 342 })
  injured: number;

  @ApiProperty({ example: 1245 })
  houses_damaged: number;

  @ApiProperty({ example: 789 })
  livestock_lost: number;

  @ApiProperty({ example: 126 })
  schools_damaged: number;
}

export class OverviewResponse {
  @ApiProperty({ type: ReportPeriod })
  report_period: ReportPeriod;

  @ApiProperty({ type: OverviewTotals })
  totals: OverviewTotals;

  @ApiProperty({ example: '2025-08-20T15:52:00Z' })
  last_updated: string;
}

export class TrendPoint {
  @ApiProperty({ example: '2025-08-14' })
  date: string;

  @ApiProperty({ example: 145 })
  value: number;
}

export class TrendResponse {
  @ApiProperty({ example: 'deaths', enum: ['deaths', 'injured', 'houses'] })
  metric: 'deaths' | 'injured' | 'houses';

  @ApiProperty({ type: [TrendPoint] })
  series: TrendPoint[];
}

export class DivisionSummary {
  @ApiProperty({ example: 'Peshawar' })
  division: string;

  @ApiProperty({ example: 45 })
  deaths: number;

  @ApiProperty({ example: 98 })
  injured: number;

  @ApiProperty({ example: 345 })
  houses_damaged: number;

  @ApiProperty({ example: 12 })
  schools_damaged: number;

  @ApiProperty({ example: 234 })
  livestock_lost: number;
}

export class DivisionSummaryResponse {
  @ApiProperty({ type: [DivisionSummary] })
  rows: DivisionSummary[];

  @ApiProperty({ type: OverviewTotals })
  totals: OverviewTotals;
}

export class CnwDamages {
  @ApiProperty({ example: 78.5 })
  roads_km: number;

  @ApiProperty({ example: 5 })
  bridges: number;

  @ApiProperty({ example: 23 })
  culverts: number;
}

export class DistrictSummaryResponse {
  @ApiProperty({ example: 'Peshawar' })
  district: string;

  @ApiProperty({ example: '2025-08-20' })
  latest_report_date: string;

  @ApiProperty({ example: 12 })
  deaths: number;

  @ApiProperty({ example: 28 })
  injured: number;

  @ApiProperty({ example: 156 })
  houses_damaged: number;

  @ApiProperty({ example: 9 })
  schools_damaged: number;

  @ApiProperty({ example: 23 })
  livestock_lost: number;

  @ApiProperty({ type: CnwDamages })
  cw: CnwDamages;

  @ApiProperty({ example: [] })
  notes: string[];

  @ApiProperty({
    example: [
      'dmis.district_incidents_reported',
      'floods.esed_school_damages',
      'floods.livestock_losses',
      'floods.cnw_assets',
    ],
  })
  sources: string[];
}

export class ChoroplethDataResponse {
  @ApiProperty({ example: 'Peshawar' })
  district: string;

  @ApiProperty({ example: 12 })
  value: number;
}

export class CoordinatesResponse {
  @ApiProperty({ example: 'Peshawar' })
  district: string;

  @ApiProperty({ example: 34.0123 })
  latitude: number;

  @ApiProperty({ example: 71.5432 })
  longitude: number;
}