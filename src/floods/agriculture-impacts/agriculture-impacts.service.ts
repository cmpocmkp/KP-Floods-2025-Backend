import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { AgricultureImpacts } from '../entities/agriculture-impacts.entity';
import { AgricultureImpactsDto, AgricultureImpactsFilterDto } from '../dtos/agriculture-impacts.dto';

@Injectable()
export class AgricultureImpactsService {
  constructor(
    @InjectRepository(AgricultureImpacts)
    private readonly agricultureImpactsRepository: Repository<AgricultureImpacts>,
  ) {}

  async upsertByDistrictAndDate(payload: AgricultureImpactsDto): Promise<AgricultureImpacts> {
    const { district, report_date, ...updateData } = payload;

    const existingRecord = await this.agricultureImpactsRepository.findOne({
      where: { district, report_date: new Date(report_date) },
    });

    if (existingRecord) {
      await this.agricultureImpactsRepository.update(
        { id: existingRecord.id },
        { ...updateData, report_date: new Date(report_date) }
      );
      return this.agricultureImpactsRepository.findOne({ where: { id: existingRecord.id } });
    } else {
      const newRecord = this.agricultureImpactsRepository.create({
        ...payload,
        report_date: new Date(report_date),
      });
      return this.agricultureImpactsRepository.save(newRecord);
    }
  }

  async getByFilters(filters: AgricultureImpactsFilterDto): Promise<AgricultureImpacts[]> {
    const { division, district, dateFrom, dateTo } = filters;
    
    const whereConditions: FindOptionsWhere<AgricultureImpacts> = {};

    if (division) whereConditions.division = division;
    if (district) whereConditions.district = district;

    if (dateFrom && dateTo) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date(dateTo));
    } else if (dateFrom) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date());
    } else if (dateTo) {
      whereConditions.report_date = Between(new Date('1900-01-01'), new Date(dateTo));
    }

    return this.agricultureImpactsRepository.find({
      where: whereConditions,
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findAll(): Promise<AgricultureImpacts[]> {
    return this.agricultureImpactsRepository.find({
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findById(id: string): Promise<AgricultureImpacts> {
    return this.agricultureImpactsRepository.findOne({ where: { id } });
  }
}