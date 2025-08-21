import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller'; // Import the custom health indicator
import { MemoryHealthIndicator } from '@nestjs/terminus'; // Memory health check
import { PostgresHealthIndicator } from './custom-indicator';

@Module({
  imports: [TerminusModule], // Terminus module for health checks
  controllers: [HealthController],
  providers: [PostgresHealthIndicator, MemoryHealthIndicator], // Register custom health indicator
})
export class HealthModule {}
