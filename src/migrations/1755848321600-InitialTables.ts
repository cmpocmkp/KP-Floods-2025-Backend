import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialTables1755848321600 implements MigrationInterface {
    name = 'InitialTables1755848321600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('super_admin', 'admin', 'admin_staff')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "user_id" character varying(50) NOT NULL, "user_name" character varying(255) NOT NULL, "email" character varying(255), "description" text, "jurisdiction" character varying(100), "role" "public"."users_role_enum" NOT NULL, "is_disabled" boolean NOT NULL DEFAULT false, "is_deleted" boolean NOT NULL DEFAULT false, "first_login" boolean NOT NULL DEFAULT false, "email_verified" boolean NOT NULL DEFAULT false, "password" character varying(255) NOT NULL, "initial_password" character varying(255), "created_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "data_id" integer NOT NULL DEFAULT '4', CONSTRAINT "UQ_96aac72f1574b88752e9fb00089" UNIQUE ("user_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "floods"."irrigation_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "report_date" date NOT NULL, "division" text NOT NULL, "district" text NOT NULL, "name_of_department" text NOT NULL DEFAULT 'Irrigation', "type_of_infrastructure_damaged" text, "specific_name_description" text, "damaged_size_length_area" text, "restoration_status" text, "approx_short_term_restoration_cost_m" numeric(16,2), "approx_complete_rehab_cost_m" numeric(16,2), "notes" text, "source" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f21e8804729b746b35e692eb051" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ca13ce4885b9b669a3b8b86050" ON "floods"."irrigation_assets" ("district", "report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_7a657e8f6597caedbff972d8fa" ON "floods"."irrigation_assets" ("report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_3c1c79a4726513f15cdff16f7c" ON "floods"."irrigation_assets" ("division", "district") `);
        await queryRunner.query(`CREATE TABLE "floods"."human_losses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "report_date" date NOT NULL, "division" text NOT NULL, "district" text NOT NULL, "department" text NOT NULL DEFAULT 'Relief', "death" integer, "total_injuries" integer, "grievous_injuries" integer, "substantial_injuries" integer, "notes" text, "source" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7d2fe2d193cb5a740e5b8c4fac1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b4e0d57157cd50c430af73ed29" ON "floods"."human_losses" ("district", "report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_4582e3e234174cb0723392acb6" ON "floods"."human_losses" ("report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_e5e8d4e465deb22f0fe972c6d2" ON "floods"."human_losses" ("division", "district") `);
        await queryRunner.query(`CREATE TABLE "floods"."agriculture_impacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "report_date" date NOT NULL, "division" text NOT NULL, "district" text NOT NULL, "department" text NOT NULL DEFAULT 'Agriculture', "structural_damages_no" integer, "crop_mask_acre" numeric(14,2), "damaged_area_gis_acre" numeric(14,2), "onground_verified_acre" numeric(14,2), "estimated_losses_million_pkr" numeric(16,2), "notes" text, "source" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6603d499325d6789b89e153630c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9e12e64c9fbdbab5aa6e5978ef" ON "floods"."agriculture_impacts" ("district", "report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_a98f51d4cccf7dcdcff328fabf" ON "floods"."agriculture_impacts" ("report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0f113e8504d4fad34a4360c46" ON "floods"."agriculture_impacts" ("division", "district") `);
        await queryRunner.query(`CREATE TABLE "floods"."energy_power_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "report_date" date NOT NULL, "division" text NOT NULL, "district" text NOT NULL, "department" text NOT NULL DEFAULT 'Energy & Power', "damages_nature" text, "minorly_damaged_no" integer, "partially_damaged_no" integer, "washed_away_no" integer, "total_projects_no" integer, "total_capacity_kw" numeric(16,3), "below_200kw" numeric(16,3), "kw_200_and_above" numeric(16,3), "estimated_cost_rehab_protection_million_pkr" numeric(16,2), "notes" text, "source" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3cc9fb91a02e9357c48ab21564d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_653fa7ba87b3e79b37e5ed9cd3" ON "floods"."energy_power_assets" ("district", "report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_c60de64a54c29127a9c5ef0ee3" ON "floods"."energy_power_assets" ("report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_0c601185e395770ed34c364dc9" ON "floods"."energy_power_assets" ("division", "district") `);
        await queryRunner.query(`CREATE TABLE "floods"."cnw_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "report_date" date NOT NULL, "division" text NOT NULL, "district" text NOT NULL, "department" text NOT NULL DEFAULT 'C&W', "road_damage_count" integer, "road_damage_report" text, "road_damage_length_km" numeric(14,3), "road_fully_restored" integer, "road_partially_restored" integer, "road_not_restored" integer, "bridges_damaged_count" integer, "bridges_damage_reported" text, "bridges_damaged_length_m" numeric(14,2), "bridges_fully_restored" integer, "bridges_partially_restored" integer, "bridges_not_restored" integer, "culverts_damage_count" integer, "culverts_damage_reports" text, "culverts_damage_length_m" numeric(14,2), "culverts_fully_restored" integer, "culverts_partially_restored" integer, "culverts_not_restored" integer, "notes" text, "source" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c507cc15a05d957154b4950ac0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_315e35a455cdcade7289d4d9e8" ON "floods"."cnw_assets" ("district", "report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_761d64b462b0e42a51826c63b1" ON "floods"."cnw_assets" ("report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_812a2d9d7e4c34ced80120887b" ON "floods"."cnw_assets" ("division", "district") `);
        await queryRunner.query(`CREATE TABLE "floods"."livestock_losses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "report_date" date NOT NULL, "division" text NOT NULL, "district" text NOT NULL, "department" text NOT NULL DEFAULT 'Livestock', "cattles_perished" integer, "big_cattles" integer, "small_cattles" integer, "other" integer, "fodder_roughages_ton" numeric(14,3), "fodder_concentrates_kg" numeric(14,3), "shelters_damaged" integer, "notes" text, "source" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3fd4dddb7aeb5c58b448b477766" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_53dd3e9669caa1acc5f4dd1e3b" ON "floods"."livestock_losses" ("district", "report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_10bbfa2b04e544abdcf29fc0d9" ON "floods"."livestock_losses" ("report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f6e4099abf89a89ee915decfc" ON "floods"."livestock_losses" ("division", "district") `);
        await queryRunner.query(`CREATE TABLE "floods"."affected_district_coordinates" ("district" text NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_28ca773655ac33f30a01690e52c" PRIMARY KEY ("district"))`);
        await queryRunner.query(`CREATE TABLE "floods"."housing_impacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "report_date" date NOT NULL, "division" text NOT NULL, "district" text NOT NULL, "department" text NOT NULL DEFAULT 'Housing', "houses_destroyed_fully" integer, "houses_destroyed_partially" integer, "shops_destroyed" integer, "petrol_pumps_destroyed" integer, "religious_places" integer, "notes" text, "source" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_795f706e504b268ad590310abc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_13bf81b08b6ef21a14d81f29ae" ON "floods"."housing_impacts" ("district", "report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_adf134a61c05e31638b4f598ab" ON "floods"."housing_impacts" ("report_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_d276c1df43746f990f48e09b35" ON "floods"."housing_impacts" ("division", "district") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "floods"."IDX_d276c1df43746f990f48e09b35"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_adf134a61c05e31638b4f598ab"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_13bf81b08b6ef21a14d81f29ae"`);
        await queryRunner.query(`DROP TABLE "floods"."housing_impacts"`);
        await queryRunner.query(`DROP TABLE "floods"."affected_district_coordinates"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_8f6e4099abf89a89ee915decfc"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_10bbfa2b04e544abdcf29fc0d9"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_53dd3e9669caa1acc5f4dd1e3b"`);
        await queryRunner.query(`DROP TABLE "floods"."livestock_losses"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_812a2d9d7e4c34ced80120887b"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_761d64b462b0e42a51826c63b1"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_315e35a455cdcade7289d4d9e8"`);
        await queryRunner.query(`DROP TABLE "floods"."cnw_assets"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_0c601185e395770ed34c364dc9"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_c60de64a54c29127a9c5ef0ee3"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_653fa7ba87b3e79b37e5ed9cd3"`);
        await queryRunner.query(`DROP TABLE "floods"."energy_power_assets"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_f0f113e8504d4fad34a4360c46"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_a98f51d4cccf7dcdcff328fabf"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_9e12e64c9fbdbab5aa6e5978ef"`);
        await queryRunner.query(`DROP TABLE "floods"."agriculture_impacts"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_e5e8d4e465deb22f0fe972c6d2"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_4582e3e234174cb0723392acb6"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_b4e0d57157cd50c430af73ed29"`);
        await queryRunner.query(`DROP TABLE "floods"."human_losses"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_3c1c79a4726513f15cdff16f7c"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_7a657e8f6597caedbff972d8fa"`);
        await queryRunner.query(`DROP INDEX "floods"."IDX_ca13ce4885b9b669a3b8b86050"`);
        await queryRunner.query(`DROP TABLE "floods"."irrigation_assets"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
