import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PheAssets } from '../entities/phe-assets.entity';
import { PheAssetsController } from './phe-assets.controller';
import { PheAssetsService } from './phe-assets.service';

@Module({
  imports: [TypeOrmModule.forFeature([PheAssets])],
  controllers: [PheAssetsController],
  providers: [PheAssetsService],
  exports: [TypeOrmModule],
})
export class PheAssetsModule {}