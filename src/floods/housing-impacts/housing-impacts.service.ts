import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { HousingImpacts } from '../entities/housing-impacts.entity';
import { HousingImpactsDto, HousingImpactsFilterDto } from '../dtos/housing-impacts.dto';

@Injectable()
export class HousingImpactsService {
  constructor(
    @InjectRepository(HousingImpacts)
    private readonly housingImpactsRepository: Repository<HousingImpacts>,
  ) {}

  async upsertByDistrictAndDate(payload: HousingImpactsDto): Promise<HousingImpacts> {
    const { district, report_date, ...updateData } = payload;

    const existingRecord = await this.housingImpactsRepository.findOne({
      where: { district, report_date: new Date(report_date) },
    });

    if (existingRecord) {
      await this.housingImpactsRepository.update(
        { id: existingRecord.id },
        { ...updateData, report_date: new Date(report_date) }
      );
      return this.housingImpactsRepository.findOne({ where: { id: existingRecord.id } });
    } else {
      const newRecord = this.housingImpactsRepository.create({
        ...payload,
        report_date: new Date(report_date),
      });
      return this.housingImpactsRepository.save(newRecord);
    }
  }

  async getByFilters(filters: HousingImpactsFilterDto): Promise<HousingImpacts[]> {
    const { division, district, dateFrom, dateTo } = filters;
    
    const whereConditions: FindOptionsWhere<HousingImpacts> = {};

    if (division) whereConditions.division = division;
    if (district) whereConditions.district = district;

    if (dateFrom && dateTo) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date(dateTo));
    } else if (dateFrom) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date());
    } else if (dateTo) {
      whereConditions.report_date = Between(new Date('1900-01-01'), new Date(dateTo));
    }

    return this.housingImpactsRepository.find({
      where: whereConditions,
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findAll(): Promise<HousingImpacts[]> {
    return this.housingImpactsRepository.find({
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findById(id: string): Promise<HousingImpacts> {
    return this.housingImpactsRepository.findOne({ where: { id } });
  }
}