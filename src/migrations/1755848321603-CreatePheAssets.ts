import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePheAssets1755848321603 implements MigrationInterface {
    name = 'CreatePheAssets1755848321603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "floods"."phe_assets" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "report_date" date NOT NULL,
            "division" text NOT NULL,
            "district" text NOT NULL,
            "department" text NOT NULL DEFAULT 'PHE',
            "tehsil" text,
            "uc" text,
            "type_of_scheme" text,
            "scheme_name" text,
            "nature_of_damage" text,
            "damage_status" text,
            "components_damaged" text,
            "minorly_damaged_no" integer,
            "partially_damaged_no" integer,
            "washed_away_no" integer,
            "total_schemes_no" integer,
            "estimated_cost_million_pkr" numeric(16,2),
            "restoration_status" text,
            "notes" text,
            "source" text,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_phe_assets" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_phe_district_date" ON "floods"."phe_assets" ("district", "report_date")`);
        await queryRunner.query(`CREATE INDEX "IDX_phe_report_date" ON "floods"."phe_assets" ("report_date")`);
        await queryRunner.query(`CREATE INDEX "IDX_phe_division_district" ON "floods"."phe_assets" ("division", "district")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "floods"."IDX_phe_division_district"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_phe_report_date"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_phe_district_date"`);
        await queryRunner.query(`DROP TABLE "floods"."phe_assets"`);
    }
}