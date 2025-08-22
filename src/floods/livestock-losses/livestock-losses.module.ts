import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivestockLossesService } from './livestock-losses.service';
import { LivestockLossesController } from './livestock-losses.controller';
import { LivestockLosses } from '../entities/livestock-losses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LivestockLosses])],
  controllers: [LivestockLossesController],
  providers: [LivestockLossesService],
  exports: [LivestockLossesService],
})
export class LivestockLossesModule {}