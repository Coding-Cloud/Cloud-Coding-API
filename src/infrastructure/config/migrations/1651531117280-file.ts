import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1651531117280 implements MigrationInterface {
  name = 'file1651531117280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION pg_trgm`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION pg_trgm`);
  }
}
