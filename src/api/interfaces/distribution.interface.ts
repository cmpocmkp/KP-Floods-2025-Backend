export interface DamageDistributionBucket {
  key: 'deaths' | 'injured' | 'houses_damaged' | 'livestock_lost';
  value: number;
}

export interface DamageDistributionResponse {
  total_incidents: number;
  buckets: DamageDistributionBucket[];
}