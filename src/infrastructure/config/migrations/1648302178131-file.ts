import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1648302178131 implements MigrationInterface {
  name = 'file1648302178131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "passworsdResetsId" uuid, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "password_reset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "token" character varying NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_f746715d1f9d535b05981cbef22" FOREIGN KEY ("passworsdResetsId") REFERENCES "password_reset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset" ADD CONSTRAINT "FK_05baebe80e9f8fab8207eda250c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "password_reset" DROP CONSTRAINT "FK_05baebe80e9f8fab8207eda250c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_f746715d1f9d535b05981cbef22"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "password_reset"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
