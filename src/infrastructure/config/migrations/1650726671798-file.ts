import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1650726671798 implements MigrationInterface {
  name = 'file1650726671798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group"
        RENAME COLUMN "createdWithProject" TO "isHidden"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group"
        RENAME COLUMN "isHidden" TO "createdWithProject"`);
  }
}
