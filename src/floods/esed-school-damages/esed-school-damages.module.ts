import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EsedSchoolDamages } from '../entities/esed-school-damages.entity';
import { EsedSchoolDamagesController } from './esed-school-damages.controller';
import { EsedSchoolDamagesService } from './esed-school-damages.service';

@Module({
  imports: [TypeOrmModule.forFeature([EsedSchoolDamages])],
  controllers: [EsedSchoolDamagesController],
  providers: [EsedSchoolDamagesService],
  exports: [TypeOrmModule],
})
export class EsedSchoolDamagesModule {}