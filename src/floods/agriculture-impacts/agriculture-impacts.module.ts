import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgricultureImpactsService } from './agriculture-impacts.service';
import { AgricultureImpactsController } from './agriculture-impacts.controller';
import { AgricultureImpacts } from '../entities/agriculture-impacts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgricultureImpacts])],
  controllers: [AgricultureImpactsController],
  providers: [AgricultureImpactsService],
  exports: [AgricultureImpactsService],
})
export class AgricultureImpactsModule {}