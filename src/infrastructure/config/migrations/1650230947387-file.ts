import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1650230947387 implements MigrationInterface {
  name = 'file1650230947387';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
        DROP CONSTRAINT "FK_f746715d1f9d535b05981cbef22"`);
    await queryRunner.query(`CREATE TABLE "asset"
                             (
                                 "id"        uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "name"      character varying NOT NULL,
                                 "s3URL"     character varying NOT NULL,
                                 "postId"    character varying,
                                 "commentId" character varying,
                                 "createdAt" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "deletedAt" TIMESTAMP,
                                 CONSTRAINT "UQ_3857d4fd690f60834481f81d4f2" UNIQUE ("s3URL"),
                                 CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "comment"
                             (
                                 "id"        uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "ownerId"   character varying NOT NULL,
                                 "postId"    character varying NOT NULL,
                                 "content"   character varying NOT NULL,
                                 "startLine" integer,
                                 "endLine"   integer,
                                 "createdAt" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "deletedAt" TIMESTAMP,
                                 CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "conversation"
                             (
                                 "id"           uuid      NOT NULL DEFAULT uuid_generate_v4(),
                                 "friendshipId" character varying,
                                 "groupId"      character varying,
                                 "createdAt"    TIMESTAMP NOT NULL DEFAULT now(),
                                 "deletedAt"    TIMESTAMP,
                                 CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "code_snippet"
                             (
                                 "id"        uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "projectId" character varying NOT NULL,
                                 "filename"  character varying NOT NULL,
                                 "language"  character varying NOT NULL,
                                 "startLine" integer           NOT NULL,
                                 "endLine"   integer           NOT NULL,
                                 "createdAt" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "deletedAt" TIMESTAMP,
                                 CONSTRAINT "PK_2ce08f698a9bf08a9dca20735e8" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "group_membership"
                             (
                                 "userId"  character varying NOT NULL,
                                 "groupId" character varying NOT NULL,
                                 "canEdit" boolean           NOT NULL,
                                 CONSTRAINT "PK_9cd83b6cfd264fcd25d6eb4a132" PRIMARY KEY ("userId", "groupId")
                             )`);
    await queryRunner.query(`CREATE TABLE "friendship"
                             (
                                 "id"        uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "user1Id"   character varying NOT NULL,
                                 "user2Id"   character varying NOT NULL,
                                 "createdAt" TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "PK_ad3484f619253191ab55a51daf4" PRIMARY KEY ("id", "user1Id", "user2Id")
                             )`);
    await queryRunner.query(`CREATE TABLE "follower"
                             (
                                 "followerId" character varying NOT NULL,
                                 "followedId" character varying NOT NULL,
                                 "createdAt"  TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "PK_e2e0bb2dc9b8bbd766eee60aeba" PRIMARY KEY ("followerId", "followedId")
                             )`);
    await queryRunner.query(`CREATE TABLE "friend_request"
                             (
                                 "requesterUserId" character varying NOT NULL,
                                 "requestedUserId" character varying NOT NULL,
                                 "createdAt"       TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "PK_381b87c8d3d64a2b6114dfe2dec" PRIMARY KEY ("requesterUserId", "requestedUserId")
                             )`);
    await queryRunner.query(`CREATE TABLE "group"
                             (
                                 "id"                 uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "name"               character varying NOT NULL,
                                 "ownerId"            character varying NOT NULL,
                                 "createdWithProject" boolean           NOT NULL DEFAULT true,
                                 "createdAt"          TIMESTAMP         NOT NULL DEFAULT now(),
                                 "deletedAt"          TIMESTAMP,
                                 CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "post"
                             (
                                 "id"            uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "ownerId"       character varying NOT NULL,
                                 "groupId"       character varying,
                                 "content"       character varying NOT NULL,
                                 "codeSnippetId" character varying,
                                 "createdAt"     TIMESTAMP         NOT NULL DEFAULT now(),
                                 "deletedAt"     TIMESTAMP,
                                 CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "user"
        DROP COLUMN "passworsdResetsId"`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD "firstname" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD "lastname" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD "birthdate" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD "passwordResetsId" uuid`);
    await queryRunner.query(
      `CREATE TYPE "public"."project_globalvisibility_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(`ALTER TABLE "project"
        ADD "globalVisibility" "public"."project_globalvisibility_enum" NOT NULL`);
    await queryRunner.query(`ALTER TABLE "project"
        ADD "creatorId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "project"
        ADD "groupId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "project"
        ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "project"
        ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "project"
        DROP CONSTRAINT "UQ_dedfea394088ed136ddadeee89c"`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD CONSTRAINT "FK_d67baf69cde077eafe3070e7cad" FOREIGN KEY ("passwordResetsId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
        DROP CONSTRAINT "FK_d67baf69cde077eafe3070e7cad"`);
    await queryRunner.query(`ALTER TABLE "project"
        ADD CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE ("name")`);
    await queryRunner.query(`ALTER TABLE "project"
        DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "project"
        DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "project"
        DROP COLUMN "groupId"`);
    await queryRunner.query(`ALTER TABLE "project"
        DROP COLUMN "creatorId"`);
    await queryRunner.query(`ALTER TABLE "project"
        DROP COLUMN "globalVisibility"`);
    await queryRunner.query(
      `DROP TYPE "public"."project_globalvisibility_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "user"
        DROP COLUMN "passwordResetsId"`);
    await queryRunner.query(`ALTER TABLE "user"
        DROP COLUMN "birthdate"`);
    await queryRunner.query(`ALTER TABLE "user"
        DROP COLUMN "lastname"`);
    await queryRunner.query(`ALTER TABLE "user"
        DROP COLUMN "firstname"`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD "passworsdResetsId" uuid`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP TABLE "group"`);
    await queryRunner.query(`DROP TABLE "friend_request"`);
    await queryRunner.query(`DROP TABLE "follower"`);
    await queryRunner.query(`DROP TABLE "friendship"`);
    await queryRunner.query(`DROP TABLE "group_membership"`);
    await queryRunner.query(`DROP TABLE "code_snippet"`);
    await queryRunner.query(`DROP TABLE "conversation"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "asset"`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD CONSTRAINT "FK_f746715d1f9d535b05981cbef22" FOREIGN KEY ("passworsdResetsId") REFERENCES "password_reset" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
