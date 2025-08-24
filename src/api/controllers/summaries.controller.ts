import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SummariesService } from '../services/summaries.service';
import { DateRangeDto } from '../dtos/date-range.dto';
import { DivisionSummaryResponse } from '../interfaces/summaries.interface';

@ApiTags('Summaries')
@Controller('api/summaries')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Get('divisions')
  @ApiOperation({
    summary: 'Get division-wise summary',
    description: 'Returns aggregated statistics by division',
  })
  @ApiResponse({
    status: 200,
    description: 'Division-wise summary retrieved successfully',
    schema: {
      example: {
        rows: [
          {
            division: 'Peshawar',
            deaths: 45,
            injured: 98,
            houses_damaged: 345,
            schools_damaged: 12,
            livestock_lost: 234,
          },
          {
            division: 'Mardan',
            deaths: 32,
            injured: 76,
            houses_damaged: 289,
            schools_damaged: 8,
            livestock_lost: 167,
          },
        ],
        totals: {
          deaths: 77,
          injured: 174,
          houses_damaged: 634,
          schools_damaged: 20,
          livestock_lost: 401,
        },
        last_updated: '2025-08-20T15:52:00Z',
      },
    },
  })
  async getDivisionSummary(
    @Query() dateRange: DateRangeDto,
  ): Promise<DivisionSummaryResponse> {
    return this.summariesService.getDivisionSummary(
      dateRange.date_from,
      dateRange.date_to,
    );
  }
}