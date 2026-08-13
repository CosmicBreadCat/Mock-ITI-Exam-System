import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedStartTimeToExamHistory1786628675435 implements MigrationInterface {
    name = 'AddedStartTimeToExamHistory1786628675435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_history" ADD "start_time" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_history" DROP COLUMN "start_time"`);
    }

}
