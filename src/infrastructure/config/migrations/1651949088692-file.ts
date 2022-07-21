import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1651949088692 implements MigrationInterface {
  name = 'file1651949088692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "conversation"
        DROP COLUMN "friendshipId"`);
    await queryRunner.query(`ALTER TABLE "conversation"
        ADD "friendshipId" uuid`);
    await queryRunner.query(`ALTER TABLE "conversation"
        DROP COLUMN "groupId"`);
    await queryRunner.query(`ALTER TABLE "conversation"
        ADD "groupId" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "conversation"
        DROP COLUMN "groupId"`);
    await queryRunner.query(`ALTER TABLE "conversation"
        ADD "groupId" character varying`);
    await queryRunner.query(`ALTER TABLE "conversation"
        DROP COLUMN "friendshipId"`);
    await queryRunner.query(`ALTER TABLE "conversation"
        ADD "friendshipId" character varying`);
  }
}
