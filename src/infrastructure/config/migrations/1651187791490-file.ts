import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1651187791490 implements MigrationInterface {
  name = 'file1651187791490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "project_user_access"
                             (
                                 "id"         uuid    NOT NULL DEFAULT uuid_generate_v4(),
                                 "userId"     uuid    NOT NULL,
                                 "projectId"  uuid    NOT NULL,
                                 "accessType" integer NOT NULL,
                                 CONSTRAINT "PK_579f4725b0b58b041223f096538" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_user_access"`);
  }
}
