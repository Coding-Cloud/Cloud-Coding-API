import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1658938264995 implements MigrationInterface {
  name = 'file1658938264995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."project_language_enum" RENAME TO "project_language_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."project_language_enum" AS ENUM('ANGULAR', 'REACT', 'QUARKUS', 'NESTJS', 'FLASK', 'CC')`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "language" TYPE "public"."project_language_enum" USING "language"::"text"::"public"."project_language_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."project_language_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."project_language_enum_old" AS ENUM('ANGULAR', 'REACT', 'QUARKUS', 'NESTJS', 'FLASK')`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "language" TYPE "public"."project_language_enum_old" USING "language"::"text"::"public"."project_language_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."project_language_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."project_language_enum_old" RENAME TO "project_language_enum"`,
    );
  }
}
