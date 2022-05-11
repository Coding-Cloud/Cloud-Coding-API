import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1651950696571 implements MigrationInterface {
  name = 'file1651950696571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "friendship"
        DROP COLUMN "conversationId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "friendship"
        ADD "conversationId" uuid NOT NULL`);
  }
}
