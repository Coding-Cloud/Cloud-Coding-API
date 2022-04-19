import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1650300174280 implements MigrationInterface {
  name = 'file1650300174280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "message"
                             (
                                 "id"             uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "content"        character varying NOT NULL,
                                 "userId"         character varying NOT NULL,
                                 "assetId"        character varying NOT NULL,
                                 "conversationId" character varying NOT NULL,
                                 "createdAt"      TIMESTAMP         NOT NULL DEFAULT now(),
                                 "deletedAt"      TIMESTAMP,
                                 CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "friendship"
        ADD "conversationId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "group"
        ADD "conversationId" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group"
        DROP COLUMN "conversationId"`);
    await queryRunner.query(`ALTER TABLE "friendship"
        DROP COLUMN "conversationId"`);
    await queryRunner.query(`DROP TABLE "message"`);
  }
}
