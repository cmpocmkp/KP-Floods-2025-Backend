import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSchemas1755848000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create floods schema
        await queryRunner.createSchema('floods', true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropSchema('floods', true, true);
    }
}