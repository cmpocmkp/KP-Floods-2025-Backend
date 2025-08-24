export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface DistrictFeature {
  type: 'Feature';
  geometry: GeoPoint;
  properties: {
    district: string;
    latest_report_date: string;
    deaths: number;
    injured: number;
    houses_damaged: number;
    schools_damaged: number;
    livestock_lost: number;
    roads_damaged_km: number;
    bridges_damaged: number;
    culverts_damaged: number;
  };
}

export interface GeoJsonResponse {
  type: 'FeatureCollection';
  features: DistrictFeature[];
}

export interface OverviewResponse {
  report_period: {
    from: string;
    to: string;
  };
  totals: {
    deaths: number;
    injured: number;
    houses_damaged: number;
    livestock_lost: number;
    schools_damaged: number;
  };
  last_updated: string;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface TrendResponse {
  metric: 'deaths' | 'injured' | 'houses';
  series: TrendPoint[];
}

export interface DivisionSummary {
  division: string;
  deaths: number;
  injured: number;
  houses_damaged: number;
  schools_damaged: number;
  livestock_lost: number;
}

export interface DivisionSummaryResponse {
  rows: DivisionSummary[];
  totals: {
    deaths: number;
    injured: number;
    houses_damaged: number;
    schools_damaged: number;
    livestock_lost: number;
  };
}

export interface DistrictSummaryResponse {
  district: string;
  latest_report_date: string;
  deaths: number;
  injured: number;
  houses_damaged: number;
  schools_damaged: number;
  livestock_lost: number;
  cw: {
    roads_km: number;
    bridges: number;
    culverts: number;
  };
  notes: string[];
  sources: string[];
}