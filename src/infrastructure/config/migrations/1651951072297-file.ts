import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1651951072297 implements MigrationInterface {
  name = 'file1651951072297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group"
        DROP COLUMN "conversationId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group"
        ADD "conversationId" uuid NOT NULL`);
  }
}
