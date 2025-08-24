import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrendsService } from '../services/trends.service';
import { TrendsQueryDto, TrendMetric, GroupBy } from '../dtos/trends.dto';
import { DateRangeDto } from '../dtos/date-range.dto';

@ApiTags('Trends')
@Controller('api/trends')
export class TrendsController {
  constructor(private readonly trendsService: TrendsService) {}

  @Get('incidents')
  @ApiOperation({
    summary: 'Get incident trends',
    description: 'Returns time series data for incidents with optional district filter',
  })
  @ApiResponse({
    status: 200,
    description: 'Incident trends retrieved successfully',
    schema: {
      example: {
        metric: 'deaths',
        scope: 'province',
        group_by: 'daily',
        series: [
          { date: '2025-08-14', value: 145 },
          { date: '2025-08-15', value: 162 },
          { date: '2025-08-16', value: 131 },
        ],
        last_updated: '2025-08-20T15:52:00Z',
        source: 'dmis.district_casualties_trend_daily',
      },
    },
  })
  async getIncidentTrend(@Query() query: TrendsQueryDto) {
    return this.trendsService.getIncidentTrend(
      query.metric || TrendMetric.DEATHS,
      query.date_from,
      query.date_to,
      query.district,
      query.group_by || GroupBy.DAILY,
      query.fill_missing ?? true,
    );
  }

  @Get('incidents/by-district')
  @ApiOperation({
    summary: 'Get incident trends by district',
    description: 'Returns time series data for top N districts',
  })
  @ApiResponse({
    status: 200,
    description: 'District-wise incident trends retrieved successfully',
    schema: {
      example: {
        metric: 'deaths',
        series: [
          {
            district: 'Peshawar',
            series: [
              { date: '2025-08-14', value: 12 },
              { date: '2025-08-15', value: 8 },
              { date: '2025-08-16', value: 15 },
            ],
          },
        ],
      },
    },
  })
  async getMultiDistrictTrend(
    @Query() query: DateRangeDto & { metric?: TrendMetric; top?: number },
  ) {
    return this.trendsService.getMultiDistrictTrend(
      query.metric || TrendMetric.DEATHS,
      query.date_from,
      query.date_to,
      query.top || 8,
    );
  }
}