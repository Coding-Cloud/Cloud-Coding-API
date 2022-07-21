import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1653409901935 implements MigrationInterface {
  name = 'file1653409901935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "asset"
        DROP COLUMN "postId"`);
    await queryRunner.query(`ALTER TABLE "comment"
        DROP COLUMN "startLine"`);
    await queryRunner.query(`ALTER TABLE "comment"
        DROP COLUMN "endLine"`);
    await queryRunner.query(`ALTER TABLE "comment"
        DROP COLUMN "postId"`);
    await queryRunner.query(`ALTER TABLE "comment"
        ADD "projectId" uuid NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comment"
        DROP COLUMN "projectId"`);
    await queryRunner.query(`ALTER TABLE "comment"
        ADD "postId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "comment"
        ADD "endLine" integer`);
    await queryRunner.query(`ALTER TABLE "comment"
        ADD "startLine" integer`);
    await queryRunner.query(`ALTER TABLE "asset"
        ADD "postId" character varying`);
  }
}
