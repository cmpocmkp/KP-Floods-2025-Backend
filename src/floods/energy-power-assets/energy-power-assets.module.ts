import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnergyPowerAssetsService } from './energy-power-assets.service';
import { EnergyPowerAssetsController } from './energy-power-assets.controller';
import { EnergyPowerAssets } from '../entities/energy-power-assets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnergyPowerAssets])],
  controllers: [EnergyPowerAssetsController],
  providers: [EnergyPowerAssetsService],
  exports: [EnergyPowerAssetsService],
})
export class EnergyPowerAssetsModule {}