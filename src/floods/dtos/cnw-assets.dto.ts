import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CnwAssetsDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  report_date: string;

  @ApiProperty({ example: 'Peshawar' })
  @IsString()
  division: string;

  @ApiProperty({ example: 'Nowshera' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'C&W', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  road_damage_count?: number;

  @ApiProperty({ example: 'Road damage report details', required: false })
  @IsOptional()
  @IsString()
  road_damage_report?: string;

  @ApiProperty({ example: 5.5, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  road_damage_length_km?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  road_fully_restored?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  road_partially_restored?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  road_not_restored?: number;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  bridges_damaged_count?: number;

  @ApiProperty({ example: 'Bridge damage details', required: false })
  @IsOptional()
  @IsString()
  bridges_damage_reported?: string;

  @ApiProperty({ example: 150.75, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  bridges_damaged_length_m?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  bridges_fully_restored?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  bridges_partially_restored?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  bridges_not_restored?: number;

  @ApiProperty({ example: 8, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  culverts_damage_count?: number;

  @ApiProperty({ example: 'Culvert damage details', required: false })
  @IsOptional()
  @IsString()
  culverts_damage_reports?: string;

  @ApiProperty({ example: 75.5, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  culverts_damage_length_m?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  culverts_fully_restored?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  culverts_partially_restored?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  culverts_not_restored?: number;

  @ApiProperty({ example: 'Infrastructure damage notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'C&W Department', required: false })
  @IsOptional()
  @IsString()
  source?: string;
}

export class CnwAssetsFilterDto {
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