import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EsedSchoolDamagesService } from './esed-school-damages.service';
import { FindEsedDto } from '../dtos/query-params.dto';

@ApiTags('ES&ED School Damages')
@Controller('api/esed')
export class EsedSchoolDamagesController {
  constructor(private readonly service: EsedSchoolDamagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get ES&ED school damages with filters and pagination' })
  async findAll(@Query() dto: FindEsedDto) {
    return this.service.findAll(dto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get summary of ES&ED school damages grouped by district or division' })
  @ApiQuery({ name: 'groupBy', enum: ['district', 'division'], required: false })
  async getSummary(@Query('groupBy') groupBy: 'district' | 'division' = 'district') {
    return this.service.getSummary(groupBy);
  }
}