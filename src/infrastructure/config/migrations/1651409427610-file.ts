import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1651409427610 implements MigrationInterface {
  name = 'file1651409427610';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project"
        ADD "uniqueName" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "project"
        ADD CONSTRAINT "UQ_e238435f2bec7042b7b86cf6da2" UNIQUE ("uniqueName")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project"
        DROP CONSTRAINT "UQ_e238435f2bec7042b7b86cf6da2"`);
    await queryRunner.query(`ALTER TABLE "project"
        DROP COLUMN "uniqueName"`);
  }
}
