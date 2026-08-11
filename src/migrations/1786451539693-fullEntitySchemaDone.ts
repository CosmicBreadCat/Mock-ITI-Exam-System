import { MigrationInterface, QueryRunner } from "typeorm";

export class FullEntitySchemaDone1786451539693 implements MigrationInterface {
    name = 'FullEntitySchemaDone1786451539693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "instructor" ("id" SERIAL NOT NULL, "salary" double precision NOT NULL, "user_id" integer, CONSTRAINT "REL_017e5f8348ae0b4f877c6339df" UNIQUE ("user_id"), CONSTRAINT "PK_ccc0348eefb581ca002c05ef2f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course_class_student" ("id" SERIAL NOT NULL, "course_class_id" integer, "student_id" integer, CONSTRAINT "UQ_c49375647bfe8b70f9c5a706e55" UNIQUE ("course_class_id", "student_id"), CONSTRAINT "PK_6dd23ef4bb5dca041e87441ba2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "intake" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, CONSTRAINT "PK_ca09c74600819624d88bf60b6fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."question_type_enum" AS ENUM('Multi-Choice', 'True-Or-False', 'Text-Based')`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "body" character varying(500) NOT NULL, "type" "public"."question_type_enum" NOT NULL DEFAULT 'Multi-Choice', "correct_answer" character varying(500) NOT NULL, "choices" character varying(500) array, CONSTRAINT "CHK_631df0b909bf2f8842cdcb491d" CHECK (
    CASE "type"
      WHEN 'Multi-Choice' THEN
        "choices" IS NOT NULL
        AND "correct_answer" <> ALL("choices")
      ELSE
        "choices" IS NULL
    END
  ), CONSTRAINT "CHK_059345f239e1fc0e9ba2d9144b" CHECK (array_length("choices", 1) <= 3), CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exam_student" ("id" SERIAL NOT NULL, "student_id" integer, "exam_id" integer, CONSTRAINT "UQ_2b2a4f9e6030894fc1ec3d23487" UNIQUE ("student_id", "exam_id"), CONSTRAINT "PK_77a5e7c775a0d8fa602d7547f1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exam_history" ("id" SERIAL NOT NULL, "degree" integer NOT NULL, "attempt" integer NOT NULL, "exam_student_id" integer, CONSTRAINT "UQ_154920e8707c5292fefe771e084" UNIQUE ("exam_student_id", "attempt"), CONSTRAINT "PK_d1c33a8423d91050064f1d8a107" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exam_question_history" ("id" SERIAL NOT NULL, "correct" boolean NOT NULL, "instructor_check" boolean NOT NULL, "answer" character varying(500) NOT NULL, "exam_question_id" integer, "exam_history_id" integer, CONSTRAINT "UQ_f396aea34ccdf84860eafa3f9bd" UNIQUE ("exam_question_id", "exam_history_id"), CONSTRAINT "PK_ab66632c1f8ea4c988de7556eb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exam_question" ("id" SERIAL NOT NULL, "degree" integer NOT NULL, "exam_id" integer, "question_id" integer, CONSTRAINT "UQ_f1c91632d3fd2494a9e35d1a3ec" UNIQUE ("exam_id", "question_id"), CONSTRAINT "PK_a1c309a024492d50f43ff8b4c67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."exam_type_enum" AS ENUM('Normal', 'Corrective')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["examsystem_dev","public","exam","GENERATED_COLUMN","total_time_min","(EXTRACT(EPOCH FROM (\"end_time\" - \"start_time\")) / 60)::int"]);
        await queryRunner.query(`CREATE TABLE "exam" ("id" SERIAL NOT NULL, "title" character varying(150) NOT NULL, "type" "public"."exam_type_enum" NOT NULL DEFAULT 'Normal', "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, "total_time_min" integer GENERATED ALWAYS AS ((EXTRACT(EPOCH FROM ("end_time" - "start_time")) / 60)::int) STORED NOT NULL, "min_degree" integer NOT NULL, "max_degree" integer NOT NULL, "late_entry_min" integer NOT NULL DEFAULT '0', "grace_period_min" integer NOT NULL DEFAULT '0', "max_attempts" integer NOT NULL DEFAULT '0', "retake_cooldown_min" integer NOT NULL DEFAULT '0', "course_class_id" integer, CONSTRAINT "CHK_429381d9c4c4f3ecf0e8ae2ada" CHECK (retake_cooldown_min >= 0 AND retake_cooldown_min <= 60), CONSTRAINT "CHK_af041bdc55086a0b4b230ba962" CHECK (max_attempts >= 0 AND max_attempts <= 5), CONSTRAINT "CHK_255db3e94073219ce9d9d5ae8c" CHECK (grace_period_min >= 0 AND grace_period_min <= 60), CONSTRAINT "CHK_0b8daf728a04963fde65b52f49" CHECK (late_entry_min >= 0 AND late_entry_min <= 60), CONSTRAINT "CHK_4f582270feed8241af5c465680" CHECK (max_degree > min_degree), CONSTRAINT "CHK_1d47fc3bbd4521cb9c895c26ab" CHECK (min_degree > 0), CONSTRAINT "CHK_7acdfaa7e93a31ddf72f642a94" CHECK (end_time > start_time), CONSTRAINT "PK_56071ab3a94aeac01f1b5ab74aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course_class" ("id" SERIAL NOT NULL, "course_id" integer, "track_id" integer, "branch_id" integer, "intake_id" integer, "instructor_id" integer, CONSTRAINT "PK_5cc7082f641d645f4b560a82927" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "description" text NOT NULL, "max_degree" integer NOT NULL, "min_degree" integer NOT NULL, CONSTRAINT "CHK_016bb910ea6db14acdd5bcd6c1" CHECK (min_degree > 0), CONSTRAINT "CHK_58e5c88b208bcf8ac68aae85fa" CHECK (max_degree > min_degree), CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course_track" ("id" SERIAL NOT NULL, "course_id" integer, "track_id" integer, CONSTRAINT "UQ_f44d117c8686a6459e0c1cc1155" UNIQUE ("course_id", "track_id"), CONSTRAINT "PK_0476bafe4696e27d9748637f35a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "track" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "department_id" integer, CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "user_id" integer, "track_id" integer, "branch_id" integer, "intake_id" integer, CONSTRAINT "REL_0cc43638ebcf41dfab27e62dc0" UNIQUE ("user_id"), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "branch" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "city_id" integer, CONSTRAINT "PK_2e39f426e2faefdaa93c5961976" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Student', 'Instructor', 'TrainingManager', 'Admin')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'Student'`);
        await queryRunner.query(`ALTER TABLE "instructor" ADD CONSTRAINT "FK_017e5f8348ae0b4f877c6339dff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_class_student" ADD CONSTRAINT "FK_93e98f27d4a675c89b0ff00c27d" FOREIGN KEY ("course_class_id") REFERENCES "course_class"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_class_student" ADD CONSTRAINT "FK_0f09d347d2bf34da768d7c74a6e" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam_student" ADD CONSTRAINT "FK_d9911b391ff1fb9dd59e792d2a3" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam_student" ADD CONSTRAINT "FK_acd9290e7a3b2d21ff7e121bddd" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam_history" ADD CONSTRAINT "FK_33b14df9da6a4770f9187a9dc15" FOREIGN KEY ("exam_student_id") REFERENCES "exam_student"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam_question_history" ADD CONSTRAINT "FK_3a1c6bd5f610b81da69d7a389ca" FOREIGN KEY ("exam_question_id") REFERENCES "exam_question"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam_question_history" ADD CONSTRAINT "FK_47f658ef561195640f81fc4918b" FOREIGN KEY ("exam_history_id") REFERENCES "exam_history"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam_question" ADD CONSTRAINT "FK_6664355ca7a2d081b4d89cc1ea3" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam_question" ADD CONSTRAINT "FK_68081ef3d5147dc089925668d87" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "FK_e67439bf4a759928a2f19e388fd" FOREIGN KEY ("course_class_id") REFERENCES "course_class"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_class" ADD CONSTRAINT "FK_1530c49d9ed49f66bdfbf408103" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_class" ADD CONSTRAINT "FK_f02485d5d249778e5fc0769e6ef" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_class" ADD CONSTRAINT "FK_10fe14a42156d6218a94b898a4b" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_class" ADD CONSTRAINT "FK_57c566cb181e040616ed62bdf1e" FOREIGN KEY ("intake_id") REFERENCES "intake"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_class" ADD CONSTRAINT "FK_91d74a1bfcf40ddeef9dfbfb3c2" FOREIGN KEY ("instructor_id") REFERENCES "instructor"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_track" ADD CONSTRAINT "FK_a31c82741d0c7324407ab58c98a" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_track" ADD CONSTRAINT "FK_0e8d9fbf5aab3ecdd7c1ca2f3f7" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_a1a46f9c1dc68dcc758a7314918" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_3f48292591426374ed798c7233a" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_b83dd3b0fb5eeef379eabd4995d" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_1c6fe6e4b18b5d7bca224b598db" FOREIGN KEY ("intake_id") REFERENCES "intake"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branch" ADD CONSTRAINT "FK_f5ef543824472fcefeaf99d4f67" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch" DROP CONSTRAINT "FK_f5ef543824472fcefeaf99d4f67"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_1c6fe6e4b18b5d7bca224b598db"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_b83dd3b0fb5eeef379eabd4995d"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_3f48292591426374ed798c7233a"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09"`);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_a1a46f9c1dc68dcc758a7314918"`);
        await queryRunner.query(`ALTER TABLE "course_track" DROP CONSTRAINT "FK_0e8d9fbf5aab3ecdd7c1ca2f3f7"`);
        await queryRunner.query(`ALTER TABLE "course_track" DROP CONSTRAINT "FK_a31c82741d0c7324407ab58c98a"`);
        await queryRunner.query(`ALTER TABLE "course_class" DROP CONSTRAINT "FK_91d74a1bfcf40ddeef9dfbfb3c2"`);
        await queryRunner.query(`ALTER TABLE "course_class" DROP CONSTRAINT "FK_57c566cb181e040616ed62bdf1e"`);
        await queryRunner.query(`ALTER TABLE "course_class" DROP CONSTRAINT "FK_10fe14a42156d6218a94b898a4b"`);
        await queryRunner.query(`ALTER TABLE "course_class" DROP CONSTRAINT "FK_f02485d5d249778e5fc0769e6ef"`);
        await queryRunner.query(`ALTER TABLE "course_class" DROP CONSTRAINT "FK_1530c49d9ed49f66bdfbf408103"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "FK_e67439bf4a759928a2f19e388fd"`);
        await queryRunner.query(`ALTER TABLE "exam_question" DROP CONSTRAINT "FK_68081ef3d5147dc089925668d87"`);
        await queryRunner.query(`ALTER TABLE "exam_question" DROP CONSTRAINT "FK_6664355ca7a2d081b4d89cc1ea3"`);
        await queryRunner.query(`ALTER TABLE "exam_question_history" DROP CONSTRAINT "FK_47f658ef561195640f81fc4918b"`);
        await queryRunner.query(`ALTER TABLE "exam_question_history" DROP CONSTRAINT "FK_3a1c6bd5f610b81da69d7a389ca"`);
        await queryRunner.query(`ALTER TABLE "exam_history" DROP CONSTRAINT "FK_33b14df9da6a4770f9187a9dc15"`);
        await queryRunner.query(`ALTER TABLE "exam_student" DROP CONSTRAINT "FK_acd9290e7a3b2d21ff7e121bddd"`);
        await queryRunner.query(`ALTER TABLE "exam_student" DROP CONSTRAINT "FK_d9911b391ff1fb9dd59e792d2a3"`);
        await queryRunner.query(`ALTER TABLE "course_class_student" DROP CONSTRAINT "FK_0f09d347d2bf34da768d7c74a6e"`);
        await queryRunner.query(`ALTER TABLE "course_class_student" DROP CONSTRAINT "FK_93e98f27d4a675c89b0ff00c27d"`);
        await queryRunner.query(`ALTER TABLE "instructor" DROP CONSTRAINT "FK_017e5f8348ae0b4f877c6339dff"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "branch"`);
        await queryRunner.query(`DROP TABLE "city"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TABLE "track"`);
        await queryRunner.query(`DROP TABLE "course_track"`);
        await queryRunner.query(`DROP TABLE "course"`);
        await queryRunner.query(`DROP TABLE "course_class"`);
        await queryRunner.query(`DROP TABLE "exam"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","total_time_min","examsystem_dev","public","exam"]);
        await queryRunner.query(`DROP TYPE "public"."exam_type_enum"`);
        await queryRunner.query(`DROP TABLE "exam_question"`);
        await queryRunner.query(`DROP TABLE "exam_question_history"`);
        await queryRunner.query(`DROP TABLE "exam_history"`);
        await queryRunner.query(`DROP TABLE "exam_student"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TYPE "public"."question_type_enum"`);
        await queryRunner.query(`DROP TABLE "intake"`);
        await queryRunner.query(`DROP TABLE "course_class_student"`);
        await queryRunner.query(`DROP TABLE "instructor"`);
        await queryRunner.query(`DROP TABLE "department"`);
    }

}
