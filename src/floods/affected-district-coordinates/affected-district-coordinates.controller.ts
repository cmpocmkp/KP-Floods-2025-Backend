import { Controller, Get, Post, Put, Delete, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AffectedDistrictCoordinatesService } from './affected-district-coordinates.service';
import { AffectedDistrictCoordinatesDto, AffectedDistrictCoordinatesFilterDto } from '../dtos/affected-district-coordinates.dto';

@ApiTags('District Coordinates')
@Controller('floods/district-coordinates')
export class AffectedDistrictCoordinatesController {
  constructor(private readonly coordinatesService: AffectedDistrictCoordinatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new district coordinates' })
  @ApiResponse({ status: 201, description: 'District coordinates created successfully' })
  async create(@Body() payload: AffectedDistrictCoordinatesDto) {
    return this.coordinatesService.create(payload);
  }

  @Post('upsert')
  @ApiOperation({ summary: 'Create or update district coordinates' })
  @ApiResponse({ status: 201, description: 'District coordinates upserted successfully' })
  async upsert(@Body() payload: AffectedDistrictCoordinatesDto) {
    return this.coordinatesService.upsertByDistrictAndDate(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Get district coordinates with optional filters' })
  @ApiQuery({ name: 'district', required: false })
  async getByFilters(@Query() filters: AffectedDistrictCoordinatesFilterDto) {
    if (Object.keys(filters).length === 0) {
      return this.coordinatesService.findAll();
    }
    return this.coordinatesService.getByFilters(filters);
  }

  @Get(':district')
  @ApiOperation({ summary: 'Get district coordinates by district name' })
  async findByDistrict(@Param('district') district: string) {
    return this.coordinatesService.findByDistrict(district);
  }

  @Put(':district')
  @ApiOperation({ summary: 'Update district coordinates' })
  async update(
    @Param('district') district: string,
    @Body() payload: Partial<AffectedDistrictCoordinatesDto>
  ) {
    return this.coordinatesService.update(district, payload);
  }

  @Delete(':district')
  @ApiOperation({ summary: 'Delete district coordinates' })
  async delete(@Param('district') district: string) {
    await this.coordinatesService.delete(district);
    return { message: `District ${district} coordinates deleted successfully` };
  }
}