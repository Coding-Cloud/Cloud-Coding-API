import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1658588851631 implements MigrationInterface {
  name = 'file1658588851631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user-editing"
                             (
                               "id"       uuid              NOT NULL DEFAULT uuid_generate_v4(),
                               "username" character varying NOT NULL,
                               "socketId" character varying NOT NULL,
                               "room"     character varying NOT NULL,
                               CONSTRAINT "UQ_707865b9f9b768e49d0e85c8db2" UNIQUE ("socketId"),
                               CONSTRAINT "PK_17789b597518ea088beae0450ff" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user-editing"`);
  }
}
