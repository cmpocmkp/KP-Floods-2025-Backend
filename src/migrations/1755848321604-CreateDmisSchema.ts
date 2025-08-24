import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDmisSchema1708821600001 implements MigrationInterface {
    name = 'CreateDmisSchema1708821600001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if table exists
        const tableExists = await queryRunner.hasTable('dmis.district_incidents_reported');
        
        if (!tableExists) {
            await queryRunner.query(`CREATE TABLE "dmis"."district_incidents_reported" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "report_date" date NOT NULL,
                "district" text NOT NULL,
                "total_deaths" integer NOT NULL,
                "total_injured" integer NOT NULL,
                "total_houses_damaged" integer NOT NULL,
                "total_other_damaged" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_district_incidents_reported" PRIMARY KEY ("id")
            )`);

            // Create indices only if table was created
            await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_dir_report_date" ON "dmis"."district_incidents_reported" ("report_date")`);
            await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_dir_district" ON "dmis"."district_incidents_reported" ("district")`);
            await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_dir_district_report_date" ON "dmis"."district_incidents_reported" ("district", "report_date")`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "dmis"."IDX_dir_district_report_date"`);
        await queryRunner.query(`DROP INDEX "dmis"."IDX_dir_district"`);
        await queryRunner.query(`DROP INDEX "dmis"."IDX_dir_report_date"`);
        await queryRunner.query(`DROP TABLE "dmis"."district_incidents_reported"`);
    }
}