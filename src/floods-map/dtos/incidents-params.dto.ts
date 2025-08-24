import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommonQueryParams } from './common-params.dto';

export class RecentIncidentsParams extends CommonQueryParams {
  @ApiProperty({
    description: 'Maximum number of incidents to return',
    example: 20,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({
    description: 'Filter by district',
    example: 'Peshawar',
    required: false,
  })
  @IsString()
  @IsOptional()
  district?: string;
}