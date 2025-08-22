import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HumanLossesDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  report_date: string;

  @ApiProperty({ example: 'Peshawar' })
  @IsString()
  division: string;

  @ApiProperty({ example: 'Nowshera' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'Relief', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  death?: number;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  total_injuries?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  grievous_injuries?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  substantial_injuries?: number;

  @ApiProperty({ example: 'Casualty report', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'Relief Department', required: false })
  @IsOptional()
  @IsString()
  source?: string;
}

export class HumanLossesFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  division?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}