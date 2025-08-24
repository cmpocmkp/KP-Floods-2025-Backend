import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { DateRangeDto } from './date-range.dto';

export enum TrendMetric {
  DEATHS = 'deaths',
  INJURED = 'injured',
  HOUSES = 'houses',
}

export enum GroupBy {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export class TrendsQueryDto extends DateRangeDto {
  @ApiPropertyOptional({ enum: TrendMetric, default: TrendMetric.DEATHS })
  @IsOptional()
  @IsEnum(TrendMetric)
  metric?: TrendMetric = TrendMetric.DEATHS;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ enum: GroupBy, default: GroupBy.DAILY })
  @IsOptional()
  @IsEnum(GroupBy)
  group_by?: GroupBy = GroupBy.DAILY;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  fill_missing?: boolean = true;
}