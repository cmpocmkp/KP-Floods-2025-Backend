import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { HumanLosses } from '../entities/human-losses.entity';
import { HumanLossesDto, HumanLossesFilterDto } from '../dtos/human-losses.dto';

@Injectable()
export class HumanLossesService {
  constructor(
    @InjectRepository(HumanLosses)
    private readonly humanLossesRepository: Repository<HumanLosses>,
  ) {}

  async upsertByDistrictAndDate(payload: HumanLossesDto): Promise<HumanLosses> {
    const { district, report_date, ...updateData } = payload;

    const existingRecord = await this.humanLossesRepository.findOne({
      where: { district, report_date: new Date(report_date) },
    });

    if (existingRecord) {
      await this.humanLossesRepository.update(
        { id: existingRecord.id },
        { ...updateData, report_date: new Date(report_date) }
      );
      return this.humanLossesRepository.findOne({ where: { id: existingRecord.id } });
    } else {
      const newRecord = this.humanLossesRepository.create({
        ...payload,
        report_date: new Date(report_date),
      });
      return this.humanLossesRepository.save(newRecord);
    }
  }

  async getByFilters(filters: HumanLossesFilterDto): Promise<HumanLosses[]> {
    const { division, district, dateFrom, dateTo } = filters;
    
    const whereConditions: FindOptionsWhere<HumanLosses> = {};

    if (division) whereConditions.division = division;
    if (district) whereConditions.district = district;

    if (dateFrom && dateTo) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date(dateTo));
    } else if (dateFrom) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date());
    } else if (dateTo) {
      whereConditions.report_date = Between(new Date('1900-01-01'), new Date(dateTo));
    }

    return this.humanLossesRepository.find({
      where: whereConditions,
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findAll(): Promise<HumanLosses[]> {
    return this.humanLossesRepository.find({
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findById(id: string): Promise<HumanLosses> {
    return this.humanLossesRepository.findOne({ where: { id } });
  }
}