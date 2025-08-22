import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EnergyPowerAssetsDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  report_date: string;

  @ApiProperty({ example: 'Peshawar' })
  @IsString()
  division: string;

  @ApiProperty({ example: 'Nowshera' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'Energy & Power', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 'Infrastructure damage details', required: false })
  @IsOptional()
  @IsString()
  damages_nature?: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minorly_damaged_no?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  partially_damaged_no?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  washed_away_no?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  total_projects_no?: number;

  @ApiProperty({ example: 5000.750, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  total_capacity_kw?: number;

  @ApiProperty({ example: 1500.250, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  below_200kw?: number;

  @ApiProperty({ example: 3500.500, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  kw_200_and_above?: number;

  @ApiProperty({ example: 125.75, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  estimated_cost_rehab_protection_million_pkr?: number;

  @ApiProperty({ example: 'Energy infrastructure damage notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'Energy Department', required: false })
  @IsOptional()
  @IsString()
  source?: string;
}

export class EnergyPowerAssetsFilterDto {
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