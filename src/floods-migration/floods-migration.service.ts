import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class FloodsMigrationService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    // Automatically run migration on module initialization
    // Comment this out if you prefer manual migration
    await this.runMigration();
  }

  async runMigration(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      
      // Start transaction for idempotent migration
      await queryRunner.startTransaction();
      
      // Create schema and extension
      await queryRunner.query('CREATE SCHEMA IF NOT EXISTS floods');
      await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

      // Create livestock_losses table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS floods.livestock_losses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          report_date DATE NOT NULL,
          division TEXT NOT NULL,
          district TEXT NOT NULL,
          department TEXT NOT NULL DEFAULT 'Livestock',
          cattles_perished INTEGER CHECK (cattles_perished >= 0),
          big_cattles INTEGER CHECK (big_cattles >= 0),
          small_cattles INTEGER CHECK (small_cattles >= 0),
          other INTEGER CHECK (other >= 0),
          fodder_roughages_ton NUMERIC(14,3) CHECK (fodder_roughages_ton >= 0),
          fodder_concentrates_kg NUMERIC(14,3) CHECK (fodder_concentrates_kg >= 0),
          shelters_damaged INTEGER CHECK (shelters_damaged >= 0),
          notes TEXT,
          source TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_livestock_losses_loc ON floods.livestock_losses (division, district)');
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_livestock_losses_date ON floods.livestock_losses (report_date)');
      await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_livestock_losses_unique ON floods.livestock_losses (district, report_date)');

      // Create human_losses table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS floods.human_losses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          report_date DATE NOT NULL,
          division TEXT NOT NULL,
          district TEXT NOT NULL,
          department TEXT NOT NULL DEFAULT 'Relief',
          death INTEGER CHECK (death >= 0),
          total_injuries INTEGER CHECK (total_injuries >= 0),
          grievous_injuries INTEGER CHECK (grievous_injuries >= 0),
          substantial_injuries INTEGER CHECK (substantial_injuries >= 0),
          notes TEXT,
          source TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_human_losses_loc ON floods.human_losses (division, district)');
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_human_losses_date ON floods.human_losses (report_date)');
      await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_human_losses_unique ON floods.human_losses (district, report_date)');

      // Create cnw_assets table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS floods.cnw_assets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          report_date DATE NOT NULL,
          division TEXT NOT NULL,
          district TEXT NOT NULL,
          department TEXT NOT NULL DEFAULT 'C&W',
          road_damage_count INTEGER CHECK (road_damage_count >= 0),
          road_damage_report TEXT,
          road_damage_length_km NUMERIC(14,3) CHECK (road_damage_length_km >= 0),
          road_fully_restored INTEGER CHECK (road_fully_restored >= 0),
          road_partially_restored INTEGER CHECK (road_partially_restored >= 0),
          road_not_restored INTEGER CHECK (road_not_restored >= 0),
          bridges_damaged_count INTEGER CHECK (bridges_damaged_count >= 0),
          bridges_damage_reported TEXT,
          bridges_damaged_length_m NUMERIC(14,2) CHECK (bridges_damaged_length_m >= 0),
          bridges_fully_restored INTEGER CHECK (bridges_fully_restored >= 0),
          bridges_partially_restored INTEGER CHECK (bridges_partially_restored >= 0),
          bridges_not_restored INTEGER CHECK (bridges_not_restored >= 0),
          culverts_damage_count INTEGER CHECK (culverts_damage_count >= 0),
          culverts_damage_reports TEXT,
          culverts_damage_length_m NUMERIC(14,2) CHECK (culverts_damage_length_m >= 0),
          culverts_fully_restored INTEGER CHECK (culverts_fully_restored >= 0),
          culverts_partially_restored INTEGER CHECK (culverts_partially_restored >= 0),
          culverts_not_restored INTEGER CHECK (culverts_not_restored >= 0),
          notes TEXT,
          source TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_cnw_loc ON floods.cnw_assets (division, district)');
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_cnw_date ON floods.cnw_assets (report_date)');
      await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_cnw_assets_unique ON floods.cnw_assets (district, report_date)');

      // Create agriculture_impacts table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS floods.agriculture_impacts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          report_date DATE NOT NULL,
          division TEXT NOT NULL,
          district TEXT NOT NULL,
          department TEXT NOT NULL DEFAULT 'Agriculture',
          structural_damages_no INTEGER CHECK (structural_damages_no >= 0),
          crop_mask_acre NUMERIC(14,2) CHECK (crop_mask_acre >= 0),
          damaged_area_gis_acre NUMERIC(14,2) CHECK (damaged_area_gis_acre >= 0),
          onground_verified_acre NUMERIC(14,2) CHECK (onground_verified_acre >= 0),
          estimated_losses_million_pkr NUMERIC(16,2) CHECK (estimated_losses_million_pkr >= 0),
          notes TEXT,
          source TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_agri_loc ON floods.agriculture_impacts (division, district)');
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_agri_date ON floods.agriculture_impacts (report_date)');
      await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_agriculture_impacts_unique ON floods.agriculture_impacts (district, report_date)');

      // Create energy_power_assets table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS floods.energy_power_assets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          report_date DATE NOT NULL,
          division TEXT NOT NULL,
          district TEXT NOT NULL,
          department TEXT NOT NULL DEFAULT 'Energy & Power',
          damages_nature TEXT,
          minorly_damaged_no INTEGER CHECK (minorly_damaged_no >= 0),
          partially_damaged_no INTEGER CHECK (partially_damaged_no >= 0),
          washed_away_no INTEGER CHECK (washed_away_no >= 0),
          total_projects_no INTEGER CHECK (total_projects_no >= 0),
          total_capacity_kw NUMERIC(16,3) CHECK (total_capacity_kw >= 0),
          below_200kw NUMERIC(16,3) CHECK (below_200kw >= 0),
          kw_200_and_above NUMERIC(16,3) CHECK (kw_200_and_above >= 0),
          estimated_cost_rehab_protection_million_pkr NUMERIC(16,2) CHECK (estimated_cost_rehab_protection_million_pkr >= 0),
          notes TEXT,
          source TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_energy_loc ON floods.energy_power_assets (division, district)');
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_energy_date ON floods.energy_power_assets (report_date)');
      await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_energy_power_assets_unique ON floods.energy_power_assets (district, report_date)');

      // Create irrigation_assets table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS floods.irrigation_assets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          report_date DATE NOT NULL,
          division TEXT NOT NULL,
          district TEXT NOT NULL,
          name_of_department TEXT NOT NULL DEFAULT 'Irrigation',
          type_of_infrastructure_damaged TEXT,
          specific_name_description TEXT,
          damaged_size_length_area TEXT,
          restoration_status TEXT,
          approx_short_term_restoration_cost_m NUMERIC(16,2) CHECK (approx_short_term_restoration_cost_m >= 0),
          approx_complete_rehab_cost_m NUMERIC(16,2) CHECK (approx_complete_rehab_cost_m >= 0),
          notes TEXT,
          source TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_irrigation_loc ON floods.irrigation_assets (division, district)');
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_irrigation_date ON floods.irrigation_assets (report_date)');
      await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_irrigation_assets_unique ON floods.irrigation_assets (district, report_date)');

      // Create housing_impacts table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS floods.housing_impacts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          report_date DATE NOT NULL,
          division TEXT NOT NULL,
          district TEXT NOT NULL,
          department TEXT NOT NULL DEFAULT 'Housing',
          houses_destroyed_fully INTEGER CHECK (houses_destroyed_fully >= 0),
          houses_destroyed_partially INTEGER CHECK (houses_destroyed_partially >= 0),
          shops_destroyed INTEGER CHECK (shops_destroyed >= 0),
          petrol_pumps_destroyed INTEGER CHECK (petrol_pumps_destroyed >= 0),
          religious_places INTEGER CHECK (religious_places >= 0),
          notes TEXT,
          source TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_housing_loc ON floods.housing_impacts (division, district)');
      await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_housing_date ON floods.housing_impacts (report_date)');
      await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_housing_impacts_unique ON floods.housing_impacts (district, report_date)');

      // Create affected_district_coordinates table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS floods.affected_district_coordinates (
          district TEXT PRIMARY KEY,
          latitude DOUBLE PRECISION NOT NULL,
          longitude DOUBLE PRECISION NOT NULL,
          latitude_longitude TEXT GENERATED ALWAYS AS (format('%.6f,%.6f', latitude, longitude)) STORED,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);

      await queryRunner.commitTransaction();
      console.log('Floods schema migration completed successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error running floods migration:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}