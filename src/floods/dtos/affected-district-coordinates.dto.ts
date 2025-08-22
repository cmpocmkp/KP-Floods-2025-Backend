import { IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AffectedDistrictCoordinatesDto {
  @ApiProperty({ example: 'Nowshera' })
  @IsString()
  district: string;

  @ApiProperty({ example: 34.015137, description: 'Latitude coordinate' })
  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 71.982421, description: 'Longitude coordinate' })
  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  longitude: number;
}

export class AffectedDistrictCoordinatesFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  district?: string;
}