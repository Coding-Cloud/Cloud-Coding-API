import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1650735521001 implements MigrationInterface {
  name = 'file1650735521001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "conversationId"`);
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "content"`);
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "assetId"`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "content" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "assetId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "conversationId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "projectId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "accessType" integer NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "accessType"`);
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "projectId"`);
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "conversationId"`);
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "assetId"`);
    await queryRunner.query(`ALTER TABLE "message"
        DROP COLUMN "content"`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "assetId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "content" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "conversationId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "message"
        ADD "deletedAt" TIMESTAMP`);
  }
}
