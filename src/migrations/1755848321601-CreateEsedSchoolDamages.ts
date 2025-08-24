import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEsedSchoolDamages1755848321601 implements MigrationInterface {
    name = 'CreateEsedSchoolDamages1755848321601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "floods"."esed_school_damages" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "report_date" date NOT NULL,
            "division" text NOT NULL,
            "district" text NOT NULL,
            "department" text NOT NULL DEFAULT 'Education (E&SE)',
            "emis_code" text,
            "school_name" text,
            "school_gender" text,
            "school_level" text,
            "tehsil" text,
            "nature_of_damage" text,
            "damage_status" text,
            "damaged_rooms" integer,
            "boundary_wall_status" text,
            "toilets_damaged" integer,
            "water_supply_damaged" boolean,
            "floor_damaged" boolean,
            "main_gate_damaged" boolean,
            "others" text,
            "notes" text,
            "source" text,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_esed_school_damages" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_esed_district_date" ON "floods"."esed_school_damages" ("district", "report_date")`);
        await queryRunner.query(`CREATE INDEX "IDX_esed_report_date" ON "floods"."esed_school_damages" ("report_date")`);
        await queryRunner.query(`CREATE INDEX "IDX_esed_division_district" ON "floods"."esed_school_damages" ("division", "district")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "floods"."IDX_esed_division_district"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_esed_report_date"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_esed_district_date"`);
        await queryRunner.query(`DROP TABLE "floods"."esed_school_damages"`);
    }
}