export interface IncidentRecord {
  date: string;
  deaths: number;
  injured: number;
  houses_damaged: number;
  cause?: string;
}

export interface InfrastructureStatus {
  roads_km: {
    fully_restored: number;
    partially_restored: number;
    not_restored: number;
  };
  bridges: {
    fully_restored: number;
    partially_restored: number;
    not_restored: number;
  };
  culverts: {
    fully_restored: number;
    partially_restored: number;
    not_restored: number;
  };
}

export interface DistrictInfrastructure {
  district: string;
  roads_km: number;
  bridges: number;
  culverts: number;
  restoration_progress: number;
}

export interface WarehouseStockByDivision {
  division: string;
  stock_value: number;
}

export interface WarehouseItemsDaily {
  date: string;
  items_issued: number;
}

export interface WarehouseTopItem {
  item: string;
  available: number;
  issued: number;
  remaining: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
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

export interface CampsFacilities {
  medical: number;
  water: number;
  sanitation: number;
  electricity: number;
  shelter: number;
}

// Stub interfaces for compensation
export interface CompensationSummary {
  total_disbursed: number;
  total_beneficiaries: number;
  average_per_beneficiary: number;
}

export interface CompensationDaily {
  date: string;
  amount_disbursed: number;
  beneficiaries: number;
}

export interface CompensationByDistrict {
  district: string;
  amount_disbursed: number;
  beneficiaries: number;
  average_per_beneficiary: number;
}