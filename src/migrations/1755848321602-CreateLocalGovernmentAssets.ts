import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLocalGovernmentAssets1755848321602 implements MigrationInterface {
    name = 'CreateLocalGovernmentAssets1755848321602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "floods"."local_government_assets" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "report_date" date NOT NULL,
            "division" text NOT NULL,
            "district" text NOT NULL,
            "department" text NOT NULL DEFAULT 'Local Government',
            "asset_type" text,
            "asset_name" text,
            "nature_of_damage" text,
            "restoration_status" text,
            "minorly_damaged_no" integer,
            "partially_damaged_no" integer,
            "washed_away_no" integer,
            "total_projects_no" integer,
            "estimated_cost_million_pkr" numeric(16,2),
            "notes" text,
            "source" text,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_local_government_assets" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_lg_district_date" ON "floods"."local_government_assets" ("district", "report_date")`);
        await queryRunner.query(`CREATE INDEX "IDX_lg_report_date" ON "floods"."local_government_assets" ("report_date")`);
        await queryRunner.query(`CREATE INDEX "IDX_lg_division_district" ON "floods"."local_government_assets" ("division", "district")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "floods"."IDX_lg_division_district"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_lg_report_date"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_lg_district_date"`);
        await queryRunner.query(`DROP TABLE "floods"."local_government_assets"`);
    }
}