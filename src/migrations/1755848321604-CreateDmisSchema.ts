import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDmisSchema1755848321604 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS dmis`);

    // Create warehouse_stock_snapshots table
    await queryRunner.query(`
      CREATE TABLE dmis.warehouse_stock_snapshots (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        report_date DATE NOT NULL,
        total_stock_available INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX idx_warehouse_stock_snapshots_report_date ON dmis.warehouse_stock_snapshots(report_date);
      CREATE UNIQUE INDEX idx_warehouse_stock_snapshots_report_date_unique ON dmis.warehouse_stock_snapshots(report_date);
    `);

    // Create warehouse_stock_items table
    await queryRunner.query(`
      CREATE TABLE dmis.warehouse_stock_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        report_date DATE NOT NULL,
        key_id INTEGER NOT NULL,
        item_value INTEGER NOT NULL,
        item_title TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX idx_warehouse_stock_items_report_date ON dmis.warehouse_stock_items(report_date);
      CREATE INDEX idx_warehouse_stock_items_item_title ON dmis.warehouse_stock_items(item_title);
      CREATE UNIQUE INDEX idx_warehouse_stock_items_report_date_item_title ON dmis.warehouse_stock_items(report_date, item_title);
    `);

    // Create warehouse_item_issued table
    await queryRunner.query(`
      CREATE TABLE dmis.warehouse_item_issued (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        report_date DATE NOT NULL,
        total_item_issued INTEGER NOT NULL,
        key_id INTEGER NOT NULL,
        item_value INTEGER NOT NULL,
        item_title TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX idx_warehouse_item_issued_report_date ON dmis.warehouse_item_issued(report_date);
      CREATE INDEX idx_warehouse_item_issued_item_title ON dmis.warehouse_item_issued(item_title);
    `);

    // Create warehouse_item_requested table
    await queryRunner.query(`
      CREATE TABLE dmis.warehouse_item_requested (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        report_date DATE NOT NULL,
        total_item_requested INTEGER NOT NULL,
        key_id INTEGER NOT NULL,
        item_value INTEGER NOT NULL,
        item_title TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX idx_warehouse_item_requested_report_date ON dmis.warehouse_item_requested(report_date);
      CREATE INDEX idx_warehouse_item_requested_item_title ON dmis.warehouse_item_requested(item_title);
    `);

    // Create warehouse_stock_by_division table
    await queryRunner.query(`
      CREATE TABLE dmis.warehouse_stock_by_division (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        report_date DATE NOT NULL,
        key_id INTEGER NOT NULL,
        item_value INTEGER NOT NULL,
        division TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX idx_warehouse_stock_by_division_report_date ON dmis.warehouse_stock_by_division(report_date);
      CREATE INDEX idx_warehouse_stock_by_division_division ON dmis.warehouse_stock_by_division(division);
      CREATE UNIQUE INDEX idx_warehouse_stock_by_division_report_date_division ON dmis.warehouse_stock_by_division(report_date, division);
    `);

    // Create division_incident_summaries table
    await queryRunner.query(`
      CREATE TABLE dmis.division_incident_summaries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        report_date DATE NOT NULL,
        division TEXT NOT NULL,
        total_deaths INTEGER NOT NULL,
        total_injured INTEGER NOT NULL,
        total_houses_damaged INTEGER NOT NULL,
        cattle_perished INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX idx_division_incident_summaries_report_date ON dmis.division_incident_summaries(report_date);
      CREATE INDEX idx_division_incident_summaries_division ON dmis.division_incident_summaries(division);
      CREATE UNIQUE INDEX idx_division_incident_summaries_report_date_division ON dmis.division_incident_summaries(report_date, division);
    `);

    // Create district_casualties_trend_daily table
    await queryRunner.query(`
      CREATE TABLE dmis.district_casualties_trend_daily (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        report_date DATE NOT NULL,
        district TEXT NOT NULL,
        total_deaths INTEGER NOT NULL,
        total_houses_damaged INTEGER NOT NULL,
        cattle_perished INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX idx_district_casualties_trend_daily_report_date ON dmis.district_casualties_trend_daily(report_date);
      CREATE INDEX idx_district_casualties_trend_daily_district ON dmis.district_casualties_trend_daily(district);
      CREATE UNIQUE INDEX idx_district_casualties_trend_daily_district_date ON dmis.district_casualties_trend_daily(district, report_date);
    `);

    // Create district_incidents_reported table
    await queryRunner.query(`
      CREATE TABLE dmis.district_incidents_reported (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        report_date DATE NOT NULL,
        district TEXT NOT NULL,
        total_deaths INTEGER NOT NULL,
        total_injured INTEGER NOT NULL,
        total_houses_damaged INTEGER NOT NULL,
        total_other_damaged INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX idx_district_incidents_reported_report_date ON dmis.district_incidents_reported(report_date);
      CREATE INDEX idx_district_incidents_reported_district ON dmis.district_incidents_reported(district);
      CREATE UNIQUE INDEX idx_district_incidents_reported_district_date ON dmis.district_incidents_reported(district, report_date);
    `);

    // Create camps_snapshot table
    await queryRunner.query(`
      CREATE TABLE dmis.camps_snapshot (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        report_date DATE NOT NULL,
        total_camps INTEGER NOT NULL,
        key_id INTEGER NOT NULL,
        item_value INTEGER NOT NULL,
        district TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX idx_camps_snapshot_report_date ON dmis.camps_snapshot(report_date);
      CREATE INDEX idx_camps_snapshot_district ON dmis.camps_snapshot(district);
      CREATE UNIQUE INDEX idx_camps_snapshot_report_date_district ON dmis.camps_snapshot(report_date, district);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS dmis.camps_snapshot`);
    await queryRunner.query(`DROP TABLE IF EXISTS dmis.district_incidents_reported`);
    await queryRunner.query(`DROP TABLE IF EXISTS dmis.district_casualties_trend_daily`);
    await queryRunner.query(`DROP TABLE IF EXISTS dmis.division_incident_summaries`);
    await queryRunner.query(`DROP TABLE IF EXISTS dmis.warehouse_stock_by_division`);
    await queryRunner.query(`DROP TABLE IF EXISTS dmis.warehouse_item_requested`);
    await queryRunner.query(`DROP TABLE IF EXISTS dmis.warehouse_item_issued`);
    await queryRunner.query(`DROP TABLE IF EXISTS dmis.warehouse_stock_items`);
    await queryRunner.query(`DROP TABLE IF EXISTS dmis.warehouse_stock_snapshots`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS dmis`);
  }
}