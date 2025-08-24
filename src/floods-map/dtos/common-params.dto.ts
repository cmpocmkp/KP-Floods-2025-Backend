import { IsDateString, IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum GroupByPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export class CommonQueryParams {
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
    description: 'Group results by period',
    enum: GroupByPeriod,
    required: false,
  })
  @IsEnum(GroupByPeriod)
  @IsOptional()
  group_by?: GroupByPeriod;

  @ApiProperty({
    description: 'Fill missing dates with zero values',
    required: false,
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  fill_missing?: boolean;

  @ApiProperty({
    description: 'Filter by division',
    required: false,
  })
  @IsString()
  @IsOptional()
  division?: string;

  @ApiProperty({
    description: 'Filter by district',
    required: false,
  })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({
    description: 'Return only latest record per district',
    required: false,
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  latest_only?: boolean;
}