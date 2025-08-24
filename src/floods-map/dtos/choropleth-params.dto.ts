import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommonQueryParams } from './common-params.dto';

export enum ChoroplethMetric {
  DEATHS = 'deaths',
  INJURED = 'injured',
  HOUSES = 'houses',
  LIVESTOCK = 'livestock',
}

export class ChoroplethParams extends CommonQueryParams {
  @ApiProperty({
    description: 'Metric to visualize',
    enum: ChoroplethMetric,
    example: ChoroplethMetric.DEATHS,
  })
  @IsEnum(ChoroplethMetric)
  metric: ChoroplethMetric;
}