import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffectedDistrictCoordinatesService } from './affected-district-coordinates.service';
import { AffectedDistrictCoordinatesController } from './affected-district-coordinates.controller';
import { AffectedDistrictCoordinates } from '../entities/affected-district-coordinates.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AffectedDistrictCoordinates])],
  controllers: [AffectedDistrictCoordinatesController],
  providers: [AffectedDistrictCoordinatesService],
  exports: [AffectedDistrictCoordinatesService],
})
export class AffectedDistrictCoordinatesModule {}