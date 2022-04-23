import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1650398708429 implements MigrationInterface {
  name = 'file1650398708429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group_membership"
        DROP CONSTRAINT "PK_9cd83b6cfd264fcd25d6eb4a132"`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        ADD CONSTRAINT "PK_d59b6ccf0c6407b3fb9b7d321ec" PRIMARY KEY ("userId")`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        DROP COLUMN "groupId"`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        ADD "groupId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        DROP CONSTRAINT "PK_d59b6ccf0c6407b3fb9b7d321ec"`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        ADD CONSTRAINT "PK_9cd83b6cfd264fcd25d6eb4a132" PRIMARY KEY ("userId", "groupId")`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        ADD CONSTRAINT "FK_b1411f07fafcd5ad93c6ee16424" FOREIGN KEY ("groupId") REFERENCES "group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group_membership"
        DROP CONSTRAINT "FK_b1411f07fafcd5ad93c6ee16424"`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        DROP CONSTRAINT "PK_9cd83b6cfd264fcd25d6eb4a132"`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        ADD CONSTRAINT "PK_d59b6ccf0c6407b3fb9b7d321ec" PRIMARY KEY ("userId")`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        DROP COLUMN "groupId"`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        ADD "groupId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        DROP CONSTRAINT "PK_d59b6ccf0c6407b3fb9b7d321ec"`);
    await queryRunner.query(`ALTER TABLE "group_membership"
        ADD CONSTRAINT "PK_9cd83b6cfd264fcd25d6eb4a132" PRIMARY KEY ("groupId", "userId")`);
  }
}
