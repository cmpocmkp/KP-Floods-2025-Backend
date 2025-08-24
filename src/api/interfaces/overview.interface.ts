export interface OverviewResponse {
  report_period: {
    from: string;
    to: string;
  };
  totals: {
    deaths: number;
    injured: number;
    houses_damaged: number;
    schools_damaged: number;
    livestock_lost: number;
  };
  last_updated: string;
  sources: string[];
}