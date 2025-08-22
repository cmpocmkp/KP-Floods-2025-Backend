import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CnwAssetsService } from './cnw-assets.service';
import { CnwAssetsController } from './cnw-assets.controller';
import { CnwAssets } from '../entities/cnw-assets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CnwAssets])],
  controllers: [CnwAssetsController],
  providers: [CnwAssetsService],
  exports: [CnwAssetsService],
})
export class CnwAssetsModule {}