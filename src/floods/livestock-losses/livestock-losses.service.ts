import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { LivestockLosses } from '../entities/livestock-losses.entity';
import { LivestockLossesDto, LivestockLossesFilterDto } from '../dtos/livestock-losses.dto';

@Injectable()
export class LivestockLossesService {
  constructor(
    @InjectRepository(LivestockLosses)
    private readonly livestockLossesRepository: Repository<LivestockLosses>,
  ) {}

  async upsertByDistrictAndDate(payload: LivestockLossesDto): Promise<LivestockLosses> {
    const { district, report_date, ...updateData } = payload;

    // Check if record exists
    const existingRecord = await this.livestockLossesRepository.findOne({
      where: { district, report_date: new Date(report_date) },
    });

    if (existingRecord) {
      // Update existing record
      await this.livestockLossesRepository.update(
        { id: existingRecord.id },
        { ...updateData, report_date: new Date(report_date) }
      );
      return this.livestockLossesRepository.findOne({ where: { id: existingRecord.id } });
    } else {
      // Create new record
      const newRecord = this.livestockLossesRepository.create({
        ...payload,
        report_date: new Date(report_date),
      });
      return this.livestockLossesRepository.save(newRecord);
    }
  }

  async getByFilters(filters: LivestockLossesFilterDto): Promise<LivestockLosses[]> {
    const { division, district, dateFrom, dateTo } = filters;
    
    const whereConditions: FindOptionsWhere<LivestockLosses> = {};

    if (division) {
      whereConditions.division = division;
    }

    if (district) {
      whereConditions.district = district;
    }

    if (dateFrom && dateTo) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date(dateTo));
    } else if (dateFrom) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date());
    } else if (dateTo) {
      whereConditions.report_date = Between(new Date('1900-01-01'), new Date(dateTo));
    }

    return this.livestockLossesRepository.find({
      where: whereConditions,
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findAll(): Promise<LivestockLosses[]> {
    return this.livestockLossesRepository.find({
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findById(id: string): Promise<LivestockLosses> {
    return this.livestockLossesRepository.findOne({ where: { id } });
  }
}