import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HumanLossesService } from './human-losses.service';
import { HumanLossesController } from './human-losses.controller';
import { HumanLosses } from '../entities/human-losses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HumanLosses])],
  controllers: [HumanLossesController],
  providers: [HumanLossesService],
  exports: [HumanLossesService],
})
export class HumanLossesModule {}