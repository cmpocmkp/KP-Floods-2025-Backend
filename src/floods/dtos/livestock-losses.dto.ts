import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LivestockLossesDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  report_date: string;

  @ApiProperty({ example: 'Peshawar' })
  @IsString()
  division: string;

  @ApiProperty({ example: 'Nowshera' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'Livestock', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  cattles_perished?: number;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  big_cattles?: number;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  small_cattles?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  other?: number;

  @ApiProperty({ example: 100.5, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  fodder_roughages_ton?: number;

  @ApiProperty({ example: 50.25, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  fodder_concentrates_kg?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  shelters_damaged?: number;

  @ApiProperty({ example: 'Flood damage report', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'District Office', required: false })
  @IsOptional()
  @IsString()
  source?: string;
}

export class LivestockLossesFilterDto {
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