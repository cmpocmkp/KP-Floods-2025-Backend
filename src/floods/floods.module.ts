import { Module } from '@nestjs/common';
import { LivestockLossesModule } from './livestock-losses/livestock-losses.module';
import { HumanLossesModule } from './human-losses/human-losses.module';
import { CnwAssetsModule } from './cnw-assets/cnw-assets.module';
import { AgricultureImpactsModule } from './agriculture-impacts/agriculture-impacts.module';
import { EnergyPowerAssetsModule } from './energy-power-assets/energy-power-assets.module';
import { IrrigationAssetsModule } from './irrigation-assets/irrigation-assets.module';
import { HousingImpactsModule } from './housing-impacts/housing-impacts.module';
import { AffectedDistrictCoordinatesModule } from './affected-district-coordinates/affected-district-coordinates.module';
import { FloodsMigrationModule } from '../floods-migration/floods-migration.module';

@Module({
  imports: [
    FloodsMigrationModule,
    LivestockLossesModule,
    HumanLossesModule,
    CnwAssetsModule,
    AgricultureImpactsModule,
    EnergyPowerAssetsModule,
    IrrigationAssetsModule,
    HousingImpactsModule,
    AffectedDistrictCoordinatesModule,
  ],
  exports: [
    LivestockLossesModule,
    HumanLossesModule,
    CnwAssetsModule,
    AgricultureImpactsModule,
    EnergyPowerAssetsModule,
    IrrigationAssetsModule,
    HousingImpactsModule,
    AffectedDistrictCoordinatesModule,
  ],
})
export class FloodsModule {}