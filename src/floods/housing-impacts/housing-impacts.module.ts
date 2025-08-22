import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousingImpactsService } from './housing-impacts.service';
import { HousingImpactsController } from './housing-impacts.controller';
import { HousingImpacts } from '../entities/housing-impacts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HousingImpacts])],
  controllers: [HousingImpactsController],
  providers: [HousingImpactsService],
  exports: [HousingImpactsService],
})
export class HousingImpactsModule {}