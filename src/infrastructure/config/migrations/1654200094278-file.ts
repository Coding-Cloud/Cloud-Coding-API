import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1654200094278 implements MigrationInterface {
  name = 'file1654200094278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "friendship"
      DROP CONSTRAINT "PK_ad3484f619253191ab55a51daf4"`);
    await queryRunner.query(`ALTER TABLE "friendship"
      ADD CONSTRAINT "PK_012d225e3c8ec3a5046e4a76bee" PRIMARY KEY ("id", "user2Id")`);
    await queryRunner.query(`ALTER TABLE "friendship"
      DROP CONSTRAINT "PK_012d225e3c8ec3a5046e4a76bee"`);
    await queryRunner.query(`ALTER TABLE "friendship"
      ADD CONSTRAINT "PK_dbd6fb568cd912c5140307075cc" PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "friendship"
      ADD CONSTRAINT "UQ_4f31989946167a1964ae8c328ed" UNIQUE ("user1Id", "user2Id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "friendship"
      DROP CONSTRAINT "UQ_4f31989946167a1964ae8c328ed"`);
    await queryRunner.query(`ALTER TABLE "friendship"
      DROP CONSTRAINT "PK_dbd6fb568cd912c5140307075cc"`);
    await queryRunner.query(`ALTER TABLE "friendship"
      ADD CONSTRAINT "PK_012d225e3c8ec3a5046e4a76bee" PRIMARY KEY ("id", "user2Id")`);
    await queryRunner.query(`ALTER TABLE "friendship"
      DROP CONSTRAINT "PK_012d225e3c8ec3a5046e4a76bee"`);
    await queryRunner.query(`ALTER TABLE "friendship"
      ADD CONSTRAINT "PK_ad3484f619253191ab55a51daf4" PRIMARY KEY ("id", "user1Id", "user2Id")`);
  }
}
