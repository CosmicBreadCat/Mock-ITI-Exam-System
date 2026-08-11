import { MigrationInterface, QueryRunner } from "typeorm";

export class MissingExamColumn1786456935503 implements MigrationInterface {
    name = 'MissingExamColumn1786456935503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ADD "pass_degree" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "CHK_f6668e36581a3010ef3dbed458" CHECK (pass_degree >= min_degree AND pass_degree <= max_degree)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "CHK_f6668e36581a3010ef3dbed458"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "pass_degree"`);
    }

}
