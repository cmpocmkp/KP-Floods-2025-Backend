import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DistributionService } from '../services/distribution.service';
import { DateRangeDto } from '../dtos/date-range.dto';
import { DamageDistributionResponse } from '../interfaces/distribution.interface';

@ApiTags('Distribution')
@Controller('api/distribution')
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}

  @Get('damage')
  @ApiOperation({
    summary: 'Get damage distribution',
    description: 'Returns distribution of damages by category for visualization',
  })
  @ApiResponse({
    status: 200,
    description: 'Damage distribution retrieved successfully',
    schema: {
      example: {
        total_incidents: 2532,
        buckets: [
          { key: 'deaths', value: 156 },
          { key: 'injured', value: 342 },
          { key: 'houses_damaged', value: 1245 },
          { key: 'livestock_lost', value: 789 },
        ],
      },
    },
  })
  async getDamageDistribution(
    @Query() dateRange: DateRangeDto,
  ): Promise<DamageDistributionResponse> {
    return this.distributionService.getDamageDistribution(
      dateRange.date_from,
      dateRange.date_to,
    );
  }
}