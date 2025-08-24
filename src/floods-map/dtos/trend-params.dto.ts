import { IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TrendMetric {
  DEATHS = 'deaths',
  INJURED = 'injured',
  HOUSES = 'houses',
}

export class TrendParamsDto {
  @ApiProperty({
    description: 'Start date (YYYY-MM-DD)',
    example: '2025-08-14',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date_from?: string;

  @ApiProperty({
    description: 'End date (YYYY-MM-DD)',
    example: '2025-08-20',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date_to?: string;

  @ApiProperty({
    description: 'Metric to trend',
    enum: TrendMetric,
    example: TrendMetric.DEATHS,
  })
  @IsEnum(TrendMetric)
  metric: TrendMetric;
}