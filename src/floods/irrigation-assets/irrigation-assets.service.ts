import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { IrrigationAssets } from '../entities/irrigation-assets.entity';
import { IrrigationAssetsDto, IrrigationAssetsFilterDto } from '../dtos/irrigation-assets.dto';

@Injectable()
export class IrrigationAssetsService {
  constructor(
    @InjectRepository(IrrigationAssets)
    private readonly irrigationAssetsRepository: Repository<IrrigationAssets>,
  ) {}

  async upsertByDistrictAndDate(payload: IrrigationAssetsDto): Promise<IrrigationAssets> {
    const { district, report_date, ...updateData } = payload;

    const existingRecord = await this.irrigationAssetsRepository.findOne({
      where: { district, report_date: new Date(report_date) },
    });

    if (existingRecord) {
      await this.irrigationAssetsRepository.update(
        { id: existingRecord.id },
        { ...updateData, report_date: new Date(report_date) }
      );
      return this.irrigationAssetsRepository.findOne({ where: { id: existingRecord.id } });
    } else {
      const newRecord = this.irrigationAssetsRepository.create({
        ...payload,
        report_date: new Date(report_date),
      });
      return this.irrigationAssetsRepository.save(newRecord);
    }
  }

  async getByFilters(filters: IrrigationAssetsFilterDto): Promise<IrrigationAssets[]> {
    const { division, district, dateFrom, dateTo } = filters;
    
    const whereConditions: FindOptionsWhere<IrrigationAssets> = {};

    if (division) whereConditions.division = division;
    if (district) whereConditions.district = district;

    if (dateFrom && dateTo) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date(dateTo));
    } else if (dateFrom) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date());
    } else if (dateTo) {
      whereConditions.report_date = Between(new Date('1900-01-01'), new Date(dateTo));
    }

    return this.irrigationAssetsRepository.find({
      where: whereConditions,
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findAll(): Promise<IrrigationAssets[]> {
    return this.irrigationAssetsRepository.find({
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findById(id: string): Promise<IrrigationAssets> {
    return this.irrigationAssetsRepository.findOne({ where: { id } });
  }
}