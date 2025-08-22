import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { AffectedDistrictCoordinates } from '../entities/affected-district-coordinates.entity';
import { AffectedDistrictCoordinatesDto, AffectedDistrictCoordinatesFilterDto } from '../dtos/affected-district-coordinates.dto';

@Injectable()
export class AffectedDistrictCoordinatesService {
  constructor(
    @InjectRepository(AffectedDistrictCoordinates)
    private readonly coordinatesRepository: Repository<AffectedDistrictCoordinates>,
  ) {}

  async upsertByDistrictAndDate(payload: AffectedDistrictCoordinatesDto): Promise<AffectedDistrictCoordinates> {
    const { district, latitude, longitude } = payload;

    // Check if record exists
    const existingRecord = await this.coordinatesRepository.findOne({
      where: { district },
    });

    if (existingRecord) {
      // Update existing record
      await this.coordinatesRepository.update(
        { district: existingRecord.district },
        { latitude, longitude }
      );
      return this.coordinatesRepository.findOne({ where: { district: existingRecord.district } });
    } else {
      // Create new record
      const newRecord = this.coordinatesRepository.create({
        district,
        latitude,
        longitude,
      });
      return this.coordinatesRepository.save(newRecord);
    }
  }

  async getByFilters(filters: AffectedDistrictCoordinatesFilterDto): Promise<AffectedDistrictCoordinates[]> {
    const { district } = filters;
    
    const whereConditions: FindOptionsWhere<AffectedDistrictCoordinates> = {};

    if (district) whereConditions.district = district;

    return this.coordinatesRepository.find({
      where: whereConditions,
      order: { district: 'ASC' },
    });
  }

  async findAll(): Promise<AffectedDistrictCoordinates[]> {
    return this.coordinatesRepository.find({
      order: { district: 'ASC' },
    });
  }

  async findByDistrict(district: string): Promise<AffectedDistrictCoordinates> {
    return this.coordinatesRepository.findOne({ where: { district } });
  }

  async create(payload: AffectedDistrictCoordinatesDto): Promise<AffectedDistrictCoordinates> {
    const existingRecord = await this.coordinatesRepository.findOne({
      where: { district: payload.district },
    });

    if (existingRecord) {
      throw new ConflictException(`District ${payload.district} coordinates already exist`);
    }

    const newRecord = this.coordinatesRepository.create(payload);
    return this.coordinatesRepository.save(newRecord);
  }

  async update(district: string, payload: Partial<AffectedDistrictCoordinatesDto>): Promise<AffectedDistrictCoordinates> {
    await this.coordinatesRepository.update({ district }, payload);
    return this.coordinatesRepository.findOne({ where: { district } });
  }

  async delete(district: string): Promise<void> {
    await this.coordinatesRepository.delete({ district });
  }
}