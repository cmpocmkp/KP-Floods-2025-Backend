import { Controller, Get, Query, Param, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FloodsMapService } from './floods-map.service';
import { DateRangeDto } from './dtos/date-range.dto';
import { TrendParamsDto } from './dtos/trend-params.dto';
import { ChoroplethParams } from './dtos/choropleth-params.dto';
import { RecentIncidentsParams } from './dtos/incidents-params.dto';
import { ChoroplethData, Coordinates } from './interfaces/additional.interface';
import {
  IncidentRecord,
  InfrastructureStatus,
  DistrictInfrastructure,
  WarehouseStockByDivision,
  WarehouseItemsDaily,
  WarehouseTopItem,
  CampsSummary,
  CampsByDistrict,
  CampsFacilities,
  CompensationSummary,
  CompensationDaily,
  CompensationByDistrict,
} from './interfaces/additional-endpoints.interface';
import * as ResponseTypes from './swagger/response-types';
import * as AdditionalResponses from './swagger/additional-responses';

@ApiTags('Floods Map')
@Controller('api')
export class FloodsMapController {
  constructor(private readonly floodsMapService: FloodsMapService) {}

  // ... [previous endpoints remain the same]

  @Get('incidents/recent')
  @ApiOperation({
    summary: 'Get recent incidents',
    description: 'Returns recent rows from district incidents table.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of recent incidents',
    type: [AdditionalResponses.IncidentRecordResponse],
  })
  async getRecentIncidents(
    @Query(new ValidationPipe({ transform: true })) params: RecentIncidentsParams,
  ): Promise<IncidentRecord[]> {
    return this.floodsMapService.getRecentIncidents(params);
  }

  @Get('incidents/:district')
  @ApiOperation({
    summary: 'Get incidents for a specific district',
    description: 'Returns incidents filtered by district and date range.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of district incidents',
    type: [AdditionalResponses.IncidentRecordResponse],
  })
  async getDistrictIncidents(
    @Param('district') district: string,
    @Query(new ValidationPipe({ transform: true })) params: DateRangeDto,
  ): Promise<IncidentRecord[]> {
    return this.floodsMapService.getDistrictIncidents(district, params);
  }

  @Get('infrastructure/status')
  @ApiOperation({
    summary: 'Get infrastructure restoration status',
    description: 'Returns restoration status counts for roads, bridges, and culverts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Infrastructure restoration status',
    type: AdditionalResponses.InfrastructureStatusResponse,
  })
  async getInfrastructureStatus(
    @Query(new ValidationPipe({ transform: true })) params: DateRangeDto,
  ): Promise<InfrastructureStatus> {
    return this.floodsMapService.getInfrastructureStatus(params);
  }

  @Get('infrastructure/by-district')
  @ApiOperation({
    summary: 'Get infrastructure status by district',
    description: 'Returns infrastructure counts and restoration progress per district.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of district infrastructure status',
    type: [AdditionalResponses.DistrictInfrastructureResponse],
  })
  async getInfrastructureByDistrict(
    @Query(new ValidationPipe({ transform: true })) params: DateRangeDto,
  ): Promise<DistrictInfrastructure[]> {
    return this.floodsMapService.getInfrastructureByDistrict(params);
  }

  @Get('warehouse/stock-by-division')
  @ApiOperation({
    summary: 'Get warehouse stock by division',
    description: 'Returns stock values grouped by division for pie chart.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of division stock values',
    type: [AdditionalResponses.WarehouseStockByDivisionResponse],
  })
  async getWarehouseStockByDivision(
    @Query(new ValidationPipe({ transform: true })) params: DateRangeDto,
  ): Promise<WarehouseStockByDivision[]> {
    return this.floodsMapService.getWarehouseStockByDivision(params);
  }

  @Get('warehouse/items-issued-daily')
  @ApiOperation({
    summary: 'Get daily items issued',
    description: 'Returns daily items issued count for bar chart.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of daily issued items',
    type: [AdditionalResponses.WarehouseItemsDailyResponse],
  })
  async getWarehouseItemsIssuedDaily(
    @Query(new ValidationPipe({ transform: true })) params: DateRangeDto,
  ): Promise<WarehouseItemsDaily[]> {
    return this.floodsMapService.getWarehouseItemsIssuedDaily(params);
  }

  @Get('warehouse/top-items')
  @ApiOperation({
    summary: 'Get top warehouse items',
    description: 'Returns status of top warehouse items.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of top items with status',
    type: [AdditionalResponses.WarehouseTopItemResponse],
  })
  async getWarehouseTopItems(
    @Query('limit') limit: number = 20,
  ): Promise<WarehouseTopItem[]> {
    return this.floodsMapService.getWarehouseTopItems(limit);
  }

  @Get('camps/summary')
  @ApiOperation({
    summary: 'Get relief camps summary',
    description: 'Returns overall camps statistics.',
  })
  @ApiResponse({
    status: 200,
    description: 'Camps summary statistics',
    type: AdditionalResponses.CampsSummaryResponse,
  })
  async getCampsSummary(
    @Query(new ValidationPipe({ transform: true })) params: DateRangeDto,
  ): Promise<CampsSummary> {
    return this.floodsMapService.getCampsSummary(params);
  }

  @Get('camps/by-district')
  @ApiOperation({
    summary: 'Get camps by district',
    description: 'Returns camps statistics per district.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of district camps statistics',
    type: [AdditionalResponses.CampsByDistrictResponse],
  })
  async getCampsByDistrict(
    @Query(new ValidationPipe({ transform: true })) params: DateRangeDto,
  ): Promise<CampsByDistrict[]> {
    return this.floodsMapService.getCampsByDistrict(params);
  }

  @Get('camps/facilities-radar')
  @ApiOperation({
    summary: 'Get camps facilities metrics',
    description: 'Returns facilities metrics for radar chart.',
  })
  @ApiResponse({
    status: 200,
    description: 'Facilities metrics for radar chart',
    type: AdditionalResponses.CampsFacilitiesResponse,
  })
  async getCampsFacilities(
    @Query(new ValidationPipe({ transform: true })) params: DateRangeDto,
  ): Promise<CampsFacilities> {
    return this.floodsMapService.getCampsFacilities(params);
  }

  @Get('compensation/summary')
  @ApiOperation({
    summary: 'Get compensation summary',
    description: 'Returns overall compensation statistics.',
  })
  @ApiResponse({
    status: 200,
    description: 'Compensation summary statistics',
    type: AdditionalResponses.CompensationSummaryResponse,
  })
  async getCompensationSummary(
    @Query(new ValidationPipe({ transform: true })) params: DateRangeDto,
  ): Promise<CompensationSummary> {
    return this.floodsMapService.getCompensationSummary(params);
  }

  @Get('compensation/daily')
  @ApiOperation({
    summary: 'Get daily compensation',
    description: 'Returns daily compensation disbursement.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of daily compensation',
    type: [AdditionalResponses.CompensationDailyResponse],
  })
  async getCompensationDaily(
    @Query(new ValidationPipe({ transform: true })) params: DateRangeDto,
  ): Promise<CompensationDaily[]> {
    return this.floodsMapService.getCompensationDaily(params);
  }

  @Get('compensation/by-district')
  @ApiOperation({
    summary: 'Get compensation by district',
    description: 'Returns compensation statistics per district.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of district compensation statistics',
    type: [AdditionalResponses.CompensationByDistrictResponse],
  })
  async getCompensationByDistrict(
    @Query(new ValidationPipe({ transform: true })) params: DateRangeDto,
  ): Promise<CompensationByDistrict[]> {
    return this.floodsMapService.getCompensationByDistrict(params);
  }
}