import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { Client } from 'pg'; // PostgreSQL client

@Injectable()
export class PostgresHealthIndicator extends HealthIndicator {
  private readonly client: Client;

  constructor() {
    super();
    this.client = new Client({
      connectionString: process.env.DATABASE_URL, // PostgreSQL connection string
    });
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.client.connect();
      await this.client.query('SELECT 1'); // Simple query to check if PostgreSQL is responsive
      return this.getStatus(key, true);
    } catch (err) {
      return this.getStatus(key, false, { message: 'PostgreSQL is down' });
    } finally {
      await this.client.end();
    }
  }
}
