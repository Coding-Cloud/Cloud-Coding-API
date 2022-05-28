import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1653341435250 implements MigrationInterface {
  name = 'file1653341435250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message"
        ALTER COLUMN "assetId" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message"
        ALTER COLUMN "assetId" SET NOT NULL`);
  }
}
