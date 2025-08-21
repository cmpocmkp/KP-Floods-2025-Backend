import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PostgresHealthIndicator } from './custom-indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private postgres: PostgresHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => this.postgres.isHealthy('postgres_db'), // Use custom health indicator
      async () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      async () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
    ]);
  }
}
