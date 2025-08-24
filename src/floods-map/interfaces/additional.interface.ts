export interface ChoroplethData {
  district: string;
  value: number;
}

export interface Coordinates {
  district: string;
  latitude: number;
  longitude: number;
}

export interface IncidentRecord {
  district: string;
  report_date: string;
  total_deaths: number;
  total_injured: number;
  total_houses_damaged: number;
  total_other_damaged: number;
}

export interface InfrastructureStatus {
  roads: {
    total_damaged_km: number;
    by_status: {
      status: string;
      km: number;
    }[];
  };
  bridges: {
    total_damaged: number;
    by_status: {
      status: string;
      count: number;
    }[];
  };
  culverts: {
    total_damaged: number;
    by_status: {
      status: string;
      count: number;
    }[];
  };
}

export interface InfrastructureByDistrict {
  district: string;
  roads_km: number;
  bridges: number;
  culverts: number;
  restoration_progress: number;
}

export interface WarehouseStockByDivision {
  division: string;
  items: {
    item_name: string;
    quantity: number;
    unit: string;
  }[];
}

export interface WarehouseIssuedDaily {
  date: string;
  items_issued: {
    item_name: string;
    quantity: number;
    unit: string;
  }[];
}

export interface WarehouseTopItem {
  item_name: string;
  total_stock: number;
  total_requested: number;
  total_issued: number;
  remaining: number;
  status: 'adequate' | 'low' | 'critical';
  unit: string;
}

export interface CampsSummary {
  total_camps: number;
  districts_with_camps: number;
  total_occupants: number;
  capacity_utilization: number;
}

export interface CampsByDistrict {
  district: string;
  camps_count: number;
  occupants: number;
  capacity: number;
  utilization: number;
}

// Stub interfaces for future compensation endpoints
export interface CompensationSummary {
  total_disbursed: number;
  total_beneficiaries: number;
  average_per_beneficiary: number;
}

export interface CompensationDaily {
  date: string;
  amount_disbursed: number;
  beneficiaries_count: number;
}

export interface CompensationByDistrict {
  district: string;
  amount_disbursed: number;
  beneficiaries_count: number;
  average_per_beneficiary: number;
}