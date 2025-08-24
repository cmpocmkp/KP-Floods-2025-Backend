export class ItemResponse {
  key_id: number;
  item_value: number;
  item_title: string;
}

export class WarehouseStockAtHandResponse {
  total_stock_available: number;
  result: ItemResponse[];
}

export class WarehouseItemIssuedResponse {
  total_item_issued: number;
  result: ItemResponse[];
}

export class WarehouseItemRequestedResponse {
  total_item_requested: number;
  result: ItemResponse[];
}

export class WarehouseStockByDivisionResponse extends Array<ItemResponse> {}

export class DivisionIncidentSummaryResponse {
  DivisionName: string;
  TotalDeaths: number;
  TotalInjured: number;
  TotalHousesDamaged: number;
  CattlePerished: number;
}

export class CampsResponse {
  total_camps: number;
  result: ItemResponse[];
}

export class DistrictCasualtiesTrendResponse {
  ReportDate: string;
  DistrictName: string;
  TotalDeaths: number;
  TotalHousesDamaged: number;
  CattlePerished: number;
}

export class DistrictIncidentsReportedResponse {
  DistrictName: string;
  TotalDeaths: number;
  TotalInjured: number;
  TotalHousesDamaged: number;
  TotalOtherDamaged: number;
}