import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1648313647017 implements MigrationInterface {
  name = 'file1648313647017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."project_language_enum" AS ENUM('ANGULAR', 'REACT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."project_status_enum" AS ENUM('INITIALISING', 'INACTIVE', 'RUNNING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "project"
       (
           "id"       uuid                             NOT NULL DEFAULT uuid_generate_v4(),
           "name"     character varying                NOT NULL,
           "language" "public"."project_language_enum" NOT NULL,
           "status"   "public"."project_status_enum"   NOT NULL,
           CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE ("name"),
           CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id")
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP TYPE "public"."project_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."project_language_enum"`);
  }
}
