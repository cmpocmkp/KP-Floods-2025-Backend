import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSchemas1708821600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create floods schema
        await queryRunner.createSchema('floods', true);
        // Create dmis schema
        await queryRunner.createSchema('dmis', true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropSchema('floods', true, true);
        await queryRunner.dropSchema('dmis', true, true);
    }
}