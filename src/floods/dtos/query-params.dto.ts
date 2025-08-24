import { IsOptional, IsString, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseFindDto {
  @IsOptional() @IsString() division?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsDateString() date_from?: string; // inclusive
  @IsOptional() @IsDateString() date_to?: string;   // inclusive
  @IsOptional() @IsString() search?: string;        // fuzzy on asset/scheme/school names

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) pageSize?: number = 50;
}

export class FindEsedDto extends BaseFindDto {}
export class FindLocalGovDto extends BaseFindDto {}
export class FindPheDto extends BaseFindDto {}