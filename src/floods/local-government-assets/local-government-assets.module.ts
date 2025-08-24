import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalGovernmentAssets } from '../entities/local-government-assets.entity';
import { LocalGovernmentAssetsController } from './local-government-assets.controller';
import { LocalGovernmentAssetsService } from './local-government-assets.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocalGovernmentAssets])],
  controllers: [LocalGovernmentAssetsController],
  providers: [LocalGovernmentAssetsService],
  exports: [TypeOrmModule],
})
export class LocalGovernmentAssetsModule {}