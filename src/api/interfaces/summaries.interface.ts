export interface DivisionRow {
  division: string;
  deaths: number;
  injured: number;
  houses_damaged: number;
  schools_damaged: number;
  livestock_lost: number;
}

export interface DivisionSummaryResponse {
  rows: DivisionRow[];
  totals: Omit<DivisionRow, 'division'>;
  last_updated: string;
}