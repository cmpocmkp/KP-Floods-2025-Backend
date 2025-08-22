import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AgricultureImpactsDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  report_date: string;

  @ApiProperty({ example: 'Peshawar' })
  @IsString()
  division: string;

  @ApiProperty({ example: 'Nowshera' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'Agriculture', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  structural_damages_no?: number;

  @ApiProperty({ example: 1500.75, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  crop_mask_acre?: number;

  @ApiProperty({ example: 1200.50, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  damaged_area_gis_acre?: number;

  @ApiProperty({ example: 1100.25, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  onground_verified_acre?: number;

  @ApiProperty({ example: 50.75, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  estimated_losses_million_pkr?: number;

  @ApiProperty({ example: 'Agricultural damage assessment', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'Agriculture Department', required: false })
  @IsOptional()
  @IsString()
  source?: string;
}

export class AgricultureImpactsFilterDto {
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