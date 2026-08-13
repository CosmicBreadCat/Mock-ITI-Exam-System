import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedExamHistoryEntites1786629223831 implements MigrationInterface {
    name = 'ModifiedExamHistoryEntites1786629223831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."exam_history_status_enum" AS ENUM('InProgress', 'Submitted', 'Reviewed')`);
        await queryRunner.query(`ALTER TABLE "exam_history" ADD "status" "public"."exam_history_status_enum" NOT NULL DEFAULT 'InProgress'`);
        await queryRunner.query(`ALTER TABLE "exam_history" ADD "end_time" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "exam_question_history" ADD "awarded_degree" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam_history" ALTER COLUMN "degree" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_history" ALTER COLUMN "degree" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam_question_history" DROP COLUMN "awarded_degree"`);
        await queryRunner.query(`ALTER TABLE "exam_history" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "exam_history" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."exam_history_status_enum"`);
    }

}
