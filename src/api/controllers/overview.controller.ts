import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OverviewService } from '../services/overview.service';
import { DateRangeDto } from '../dtos/date-range.dto';
import { OverviewResponse } from '../interfaces/overview.interface';

@ApiTags('Overview')
@Controller('api/overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get()
  @ApiOperation({
    summary: 'Get overview statistics',
    description: 'Returns aggregated statistics for deaths, injuries, damages, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Overview statistics retrieved successfully',
    schema: {
      example: {
        report_period: { from: '2025-08-14', to: '2025-08-20' },
        totals: {
          deaths: 156,
          injured: 342,
          houses_damaged: 1245,
          schools_damaged: 126,
          livestock_lost: 789,
        },
        last_updated: '2025-08-20T15:52:00Z',
        sources: [
          'dmis.district_incidents_reported',
          'floods.esed_school_damages',
          'floods.livestock_losses',
        ],
      },
    },
  })
  async getOverview(@Query() dateRange: DateRangeDto): Promise<OverviewResponse> {
    return this.overviewService.getOverview(dateRange.date_from, dateRange.date_to);
  }
}