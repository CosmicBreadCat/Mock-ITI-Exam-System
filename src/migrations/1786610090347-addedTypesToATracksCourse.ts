import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTypesToATracksCourse1786610090347 implements MigrationInterface {
    name = 'AddedTypesToATracksCourse1786610090347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."track_course_type_enum" AS ENUM('Mandatory', 'Optional')`);
        await queryRunner.query(`ALTER TABLE "track_course" ADD "type" "public"."track_course_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_course" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."track_course_type_enum"`);
    }

}
