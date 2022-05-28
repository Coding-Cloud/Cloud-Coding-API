import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1653744299081 implements MigrationInterface {
  name = 'file1653744299081';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user-socket"
                             (
                               "id"         uuid              NOT NULL DEFAULT uuid_generate_v4(),
                               "userId"     uuid              NOT NULL,
                               "socketId"   character varying NOT NULL,
                               "instanceId" uuid              NOT NULL,
                               CONSTRAINT "UQ_0dcce65235ed7969f1af6ee013f" UNIQUE ("socketId"),
                               CONSTRAINT "PK_97bf6eebbf8977bc7d7873ad632" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user-socket"`);
  }
}
