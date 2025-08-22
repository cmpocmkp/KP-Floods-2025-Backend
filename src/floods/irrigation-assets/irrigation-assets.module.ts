import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrrigationAssetsService } from './irrigation-assets.service';
import { IrrigationAssetsController } from './irrigation-assets.controller';
import { IrrigationAssets } from '../entities/irrigation-assets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IrrigationAssets])],
  controllers: [IrrigationAssetsController],
  providers: [IrrigationAssetsService],
  exports: [IrrigationAssetsService],
})
export class IrrigationAssetsModule {}