import { ApiProperty } from '@nestjs/swagger';

export class IncidentRecordResponse {
  @ApiProperty({ example: '2025-08-20' })
  date: string;

  @ApiProperty({ example: 12 })
  deaths: number;

  @ApiProperty({ example: 28 })
  injured: number;

  @ApiProperty({ example: 156 })
  houses_damaged: number;

  @ApiProperty({ example: 'Flash flood', required: false })
  cause?: string;
}

export class InfrastructureStatusCounts {
  @ApiProperty({ example: 45 })
  fully_restored: number;

  @ApiProperty({ example: 23 })
  partially_restored: number;

  @ApiProperty({ example: 12 })
  not_restored: number;
}

export class InfrastructureStatusResponse {
  @ApiProperty({ type: InfrastructureStatusCounts })
  roads_km: InfrastructureStatusCounts;

  @ApiProperty({ type: InfrastructureStatusCounts })
  bridges: InfrastructureStatusCounts;

  @ApiProperty({ type: InfrastructureStatusCounts })
  culverts: InfrastructureStatusCounts;
}

export class DistrictInfrastructureResponse {
  @ApiProperty({ example: 'Peshawar' })
  district: string;

  @ApiProperty({ example: 78.5 })
  roads_km: number;

  @ApiProperty({ example: 5 })
  bridges: number;

  @ApiProperty({ example: 23 })
  culverts: number;

  @ApiProperty({ example: 0.65 })
  restoration_progress: number;
}

export class WarehouseStockByDivisionResponse {
  @ApiProperty({ example: 'Peshawar' })
  division: string;

  @ApiProperty({ example: 25000 })
  stock_value: number;
}

export class WarehouseItemsDailyResponse {
  @ApiProperty({ example: '2025-08-20' })
  date: string;

  @ApiProperty({ example: 150 })
  items_issued: number;
}

export class WarehouseTopItemResponse {
  @ApiProperty({ example: 'Food Packages' })
  item: string;

  @ApiProperty({ example: 2500 })
  available: number;

  @ApiProperty({ example: 1800 })
  issued: number;

  @ApiProperty({ example: 700 })
  remaining: number;

  @ApiProperty({ example: 'In Stock', enum: ['In Stock', 'Low Stock', 'Out of Stock'] })
  status: string;
}

export class CampsSummaryResponse {
  @ApiProperty({ example: 45 })
  total_camps: number;

  @ApiProperty({ example: 12 })
  districts_with_camps: number;

  @ApiProperty({ example: 2500 })
  total_occupants: number;

  @ApiProperty({ example: 0.85 })
  capacity_utilization: number;
}

export class CampsByDistrictResponse {
  @ApiProperty({ example: 'Peshawar' })
  district: string;

  @ApiProperty({ example: 5 })
  camps_count: number;

  @ApiProperty({ example: 250 })
  occupants: number;

  @ApiProperty({ example: 300 })
  capacity: number;

  @ApiProperty({ example: 0.83 })
  utilization: number;
}

export class CampsFacilitiesResponse {
  @ApiProperty({ example: 0.85 })
  medical: number;

  @ApiProperty({ example: 0.95 })
  water: number;

  @ApiProperty({ example: 0.75 })
  sanitation: number;

  @ApiProperty({ example: 0.80 })
  electricity: number;

  @ApiProperty({ example: 1.0 })
  shelter: number;
}

export class CompensationSummaryResponse {
  @ApiProperty({ example: 5000000 })
  total_disbursed: number;

  @ApiProperty({ example: 1200 })
  total_beneficiaries: number;

  @ApiProperty({ example: 4166.67 })
  average_per_beneficiary: number;
}

export class CompensationDailyResponse {
  @ApiProperty({ example: '2025-08-20' })
  date: string;

  @ApiProperty({ example: 250000 })
  amount_disbursed: number;

  @ApiProperty({ example: 60 })
  beneficiaries: number;
}

export class CompensationByDistrictResponse {
  @ApiProperty({ example: 'Peshawar' })
  district: string;

  @ApiProperty({ example: 750000 })
  amount_disbursed: number;

  @ApiProperty({ example: 180 })
  beneficiaries: number;

  @ApiProperty({ example: 4166.67 })
  average_per_beneficiary: number;
}