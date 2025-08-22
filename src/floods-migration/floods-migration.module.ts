import { Module } from '@nestjs/common';
import { FloodsMigrationService } from './floods-migration.service';

@Module({
  providers: [FloodsMigrationService],
  exports: [FloodsMigrationService],
})
export class FloodsMigrationModule {}