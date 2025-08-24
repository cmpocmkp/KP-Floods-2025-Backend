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
      async () => this.postgres.isHealthy('postgres_db'),
      // Check if heap is under 512MB
      async () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
      // Check if RSS is under 1GB
      async () => this.memory.checkRSS('memory_rss', 1024 * 1024 * 1024),
    ]);
  }
}
