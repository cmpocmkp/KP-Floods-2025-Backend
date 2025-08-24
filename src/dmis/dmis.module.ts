import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { DmisService } from './dmis.service';
import { DmisCronService } from './dmis-cron.service';
import { DmisCommand } from './dmis.command';

import { WarehouseStockSnapshots } from './entities/warehouse-stock-snapshots.entity';
import { WarehouseStockItems } from './entities/warehouse-stock-items.entity';
import { WarehouseItemIssued } from './entities/warehouse-item-issued.entity';
import { WarehouseItemRequested } from './entities/warehouse-item-requested.entity';
import { WarehouseStockByDivision } from './entities/warehouse-stock-by-division.entity';
import { DivisionIncidentSummaries } from './entities/division-incident-summaries.entity';
import { DistrictCasualtiesTrendDaily } from './entities/district-casualties-trend-daily.entity';
import { DistrictIncidentsReported } from './entities/district-incidents-reported.entity';
import { CampsSnapshot } from './entities/camps-snapshot.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      WarehouseStockSnapshots,
      WarehouseStockItems,
      WarehouseItemIssued,
      WarehouseItemRequested,
      WarehouseStockByDivision,
      DivisionIncidentSummaries,
      DistrictCasualtiesTrendDaily,
      DistrictIncidentsReported,
      CampsSnapshot,
    ]),
  ],
  providers: [DmisService, DmisCronService, DmisCommand],
  exports: [DmisService],
})
export class DmisModule {}