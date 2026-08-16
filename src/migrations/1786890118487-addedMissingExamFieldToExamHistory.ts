import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedMissingExamFieldToExamHistory1786890118487 implements MigrationInterface {
    name = 'AddedMissingExamFieldToExamHistory1786890118487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_history" ADD "exam_id" integer`);
        await queryRunner.query(`ALTER TABLE "exam_history" ADD CONSTRAINT "FK_5d90741197b90fe6672bdf25bd0" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_history" DROP CONSTRAINT "FK_5d90741197b90fe6672bdf25bd0"`);
        await queryRunner.query(`ALTER TABLE "exam_history" DROP COLUMN "exam_id"`);
    }

}
