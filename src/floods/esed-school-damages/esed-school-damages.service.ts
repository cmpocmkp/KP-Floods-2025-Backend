import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { EsedSchoolDamages } from '../entities/esed-school-damages.entity';
import { FindEsedDto } from '../dtos/query-params.dto';

@Injectable()
export class EsedSchoolDamagesService {
  constructor(
    @InjectRepository(EsedSchoolDamages)
    private readonly repository: Repository<EsedSchoolDamages>,
  ) {}

  private buildListQuery(dto: FindEsedDto) {
    const query = this.repository.createQueryBuilder('esed');

    if (dto.division) {
      query.andWhere('LOWER(esed.division) = LOWER(:division)', { division: dto.division });
    }

    if (dto.district) {
      query.andWhere('LOWER(esed.district) = LOWER(:district)', { district: dto.district });
    }

    if (dto.date_from) {
      query.andWhere('esed.report_date >= :dateFrom', { dateFrom: dto.date_from });
    }

    if (dto.date_to) {
      query.andWhere('esed.report_date <= :dateTo', { dateTo: dto.date_to });
    }

    if (dto.search) {
      query.andWhere(
        '(LOWER(esed.school_name) LIKE LOWER(:search) OR LOWER(esed.nature_of_damage) LIKE LOWER(:search))',
        { search: `%${dto.search}%` }
      );
    }

    return query;
  }

  async findAll(dto: FindEsedDto) {
    const query = this.buildListQuery(dto);
    
    // Ensure page and pageSize are numbers with defaults
    const page = dto.page ? Number(dto.page) : 1;
    const pageSize = dto.pageSize ? Number(dto.pageSize) : 50;
    
    const [data, total] = await Promise.all([
      query
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .orderBy('esed.report_date', 'DESC')
        .addOrderBy('esed.district', 'ASC')
        .getMany(),
      query.getCount()
    ]);

    return {
      data,
      page,
      pageSize,
      total
    };
  }

  async getSummary(groupBy: 'district' | 'division' = 'district') {
    const query = this.repository.createQueryBuilder('esed')
      .select([
        `esed.${groupBy}`,
        'COUNT(esed.id) as total_records',
        'COUNT(esed.damaged_rooms) as total_damaged_rooms',
        'COUNT(esed.toilets_damaged) as total_toilets_damaged',
        'SUM(CASE WHEN esed.water_supply_damaged THEN 1 ELSE 0 END) as total_water_supply_damaged',
        'SUM(CASE WHEN esed.floor_damaged THEN 1 ELSE 0 END) as total_floor_damaged',
        'SUM(CASE WHEN esed.main_gate_damaged THEN 1 ELSE 0 END) as total_main_gate_damaged',
        'COUNT(CASE WHEN esed.damage_status = \'Fully\' THEN 1 END) as fully_damaged',
        'COUNT(CASE WHEN esed.damage_status = \'Partially\' THEN 1 END) as partially_damaged'
      ])
      .groupBy(`esed.${groupBy}`)
      .orderBy(`esed.${groupBy}`, 'ASC');

    return query.getRawMany();
  }
}