import { MigrationInterface, QueryRunner } from "typeorm";

export class FlippedCourseTrackPivotTable1786607988064 implements MigrationInterface {
    name = 'FlippedCourseTrackPivotTable1786607988064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instructor" DROP CONSTRAINT "FK_017e5f8348ae0b4f877c6339dff"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09"`);
        await queryRunner.query(`CREATE TABLE "track_course" ("id" SERIAL NOT NULL, "track_id" integer, "course_id" integer, CONSTRAINT "UQ_0c522d428b302d53b3600d11d17" UNIQUE ("track_id", "course_id"), CONSTRAINT "PK_195a7b5e59923bee0226efabdd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "instructor" ADD CONSTRAINT "FK_017e5f8348ae0b4f877c6339dff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_course" ADD CONSTRAINT "FK_35f353482599e5ac04ba21d6cb8" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_course" ADD CONSTRAINT "FK_388b400a5a89c8af7f04d383b69" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09"`);
        await queryRunner.query(`ALTER TABLE "track_course" DROP CONSTRAINT "FK_388b400a5a89c8af7f04d383b69"`);
        await queryRunner.query(`ALTER TABLE "track_course" DROP CONSTRAINT "FK_35f353482599e5ac04ba21d6cb8"`);
        await queryRunner.query(`ALTER TABLE "instructor" DROP CONSTRAINT "FK_017e5f8348ae0b4f877c6339dff"`);
        await queryRunner.query(`DROP TABLE "track_course"`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "instructor" ADD CONSTRAINT "FK_017e5f8348ae0b4f877c6339dff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
