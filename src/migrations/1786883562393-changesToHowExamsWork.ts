import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangesToHowExamsWork1786883562393 implements MigrationInterface {
    name = 'ChangesToHowExamsWork1786883562393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "CHK_429381d9c4c4f3ecf0e8ae2ada"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "CHK_af041bdc55086a0b4b230ba962"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "CHK_255db3e94073219ce9d9d5ae8c"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "CHK_0b8daf728a04963fde65b52f49"`);
        await queryRunner.query(`ALTER TABLE "exam_history" DROP CONSTRAINT "UQ_154920e8707c5292fefe771e084"`);
        await queryRunner.query(`ALTER TABLE "exam_history" DROP COLUMN "attempt"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "total_time_min"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","total_time_min","examsystem_dev","public","exam"]);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "late_entry_min"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "grace_period_min"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "max_attempts"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "retake_cooldown_min"`);
        await queryRunner.query(`ALTER TABLE "exam_history" ADD "submitted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "window_duration_min" integer GENERATED ALWAYS AS ((EXTRACT(EPOCH FROM ("end_time" - "start_time")) / 60)::int) STORED NOT NULL`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["examsystem_dev","public","exam","GENERATED_COLUMN","window_duration_min","(EXTRACT(EPOCH FROM (\"end_time\" - \"start_time\")) / 60)::int"]);
        await queryRunner.query(`ALTER TABLE "exam" ADD "session_duration_min" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam_history" DROP CONSTRAINT "FK_33b14df9da6a4770f9187a9dc15"`);
        await queryRunner.query(`ALTER TABLE "exam_history" ALTER COLUMN "end_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam_history" ADD CONSTRAINT "UQ_33b14df9da6a4770f9187a9dc15" UNIQUE ("exam_student_id")`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "CHK_a3b332af48addb2a311b4f0253" CHECK (session_duration_min > 0)`);
        await queryRunner.query(`ALTER TABLE "exam_history" ADD CONSTRAINT "FK_33b14df9da6a4770f9187a9dc15" FOREIGN KEY ("exam_student_id") REFERENCES "exam_student"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_history" DROP CONSTRAINT "FK_33b14df9da6a4770f9187a9dc15"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "CHK_a3b332af48addb2a311b4f0253"`);
        await queryRunner.query(`ALTER TABLE "exam_history" DROP CONSTRAINT "UQ_33b14df9da6a4770f9187a9dc15"`);
        await queryRunner.query(`ALTER TABLE "exam_history" ALTER COLUMN "end_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam_history" ADD CONSTRAINT "FK_33b14df9da6a4770f9187a9dc15" FOREIGN KEY ("exam_student_id") REFERENCES "exam_student"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "session_duration_min"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","window_duration_min","examsystem_dev","public","exam"]);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "window_duration_min"`);
        await queryRunner.query(`ALTER TABLE "exam_history" DROP COLUMN "submitted_at"`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "retake_cooldown_min" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "max_attempts" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "grace_period_min" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "late_entry_min" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["examsystem_dev","public","exam","GENERATED_COLUMN","total_time_min","(EXTRACT(EPOCH FROM (\"end_time\" - \"start_time\")) / 60)::int"]);
        await queryRunner.query(`ALTER TABLE "exam" ADD "total_time_min" integer GENERATED ALWAYS AS ((EXTRACT(EPOCH FROM ("end_time" - "start_time")) / 60)::int) STORED NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam_history" ADD "attempt" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam_history" ADD CONSTRAINT "UQ_154920e8707c5292fefe771e084" UNIQUE ("attempt", "exam_student_id")`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "CHK_0b8daf728a04963fde65b52f49" CHECK (((late_entry_min >= 0) AND (late_entry_min <= 60)))`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "CHK_255db3e94073219ce9d9d5ae8c" CHECK (((grace_period_min >= 0) AND (grace_period_min <= 60)))`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "CHK_af041bdc55086a0b4b230ba962" CHECK (((max_attempts >= 0) AND (max_attempts <= 5)))`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "CHK_429381d9c4c4f3ecf0e8ae2ada" CHECK (((retake_cooldown_min >= 0) AND (retake_cooldown_min <= 60)))`);
    }

}
