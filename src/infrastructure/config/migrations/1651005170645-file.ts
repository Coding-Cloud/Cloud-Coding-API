import { MigrationInterface, QueryRunner } from 'typeorm';

export class file1651005170645 implements MigrationInterface {
  name = 'file1651005170645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project-user-access" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "projectId" uuid NOT NULL, "accessType" integer NOT NULL, CONSTRAINT "PK_15e60667d87dee13fd9004db584" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "accessType"`);
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "projectId"`);
    await queryRunner.query(
      `ALTER TABLE "code_snippet" DROP COLUMN "projectId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "code_snippet" ADD "projectId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "PK_e2e0bb2dc9b8bbd766eee60aeba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "PK_77006d7580f807db59887bca894" PRIMARY KEY ("followedId")`,
    );
    await queryRunner.query(`ALTER TABLE "follower" DROP COLUMN "followerId"`);
    await queryRunner.query(
      `ALTER TABLE "follower" ADD "followerId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "PK_77006d7580f807db59887bca894"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "PK_e2e0bb2dc9b8bbd766eee60aeba" PRIMARY KEY ("followedId", "followerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "PK_e2e0bb2dc9b8bbd766eee60aeba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "PK_b100536f62259b7aa3733175e53" PRIMARY KEY ("followerId")`,
    );
    await queryRunner.query(`ALTER TABLE "follower" DROP COLUMN "followedId"`);
    await queryRunner.query(
      `ALTER TABLE "follower" ADD "followedId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "PK_b100536f62259b7aa3733175e53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "PK_e2e0bb2dc9b8bbd766eee60aeba" PRIMARY KEY ("followerId", "followedId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" DROP CONSTRAINT "PK_9cd83b6cfd264fcd25d6eb4a132"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" ADD CONSTRAINT "PK_b1411f07fafcd5ad93c6ee16424" PRIMARY KEY ("groupId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" DROP CONSTRAINT "PK_b1411f07fafcd5ad93c6ee16424"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" ADD CONSTRAINT "PK_9cd83b6cfd264fcd25d6eb4a132" PRIMARY KEY ("groupId", "userId")`,
    );
    await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "ownerId"`);
    await queryRunner.query(`ALTER TABLE "group" ADD "ownerId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "conversationId"`);
    await queryRunner.query(
      `ALTER TABLE "group" ADD "conversationId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "message" ADD "userId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "assetId"`);
    await queryRunner.query(
      `ALTER TABLE "message" ADD "assetId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP COLUMN "conversationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD "conversationId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "ownerId"`);
    await queryRunner.query(`ALTER TABLE "post" ADD "ownerId" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "PK_381b87c8d3d64a2b6114dfe2dec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "PK_70e51c6645a79339c1e65124c26" PRIMARY KEY ("requestedUserId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP COLUMN "requesterUserId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD "requesterUserId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "PK_70e51c6645a79339c1e65124c26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "PK_381b87c8d3d64a2b6114dfe2dec" PRIMARY KEY ("requestedUserId", "requesterUserId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "PK_381b87c8d3d64a2b6114dfe2dec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "PK_d5a6c973b9f2a7ba22f0e67354b" PRIMARY KEY ("requesterUserId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP COLUMN "requestedUserId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD "requestedUserId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "PK_d5a6c973b9f2a7ba22f0e67354b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "PK_381b87c8d3d64a2b6114dfe2dec" PRIMARY KEY ("requesterUserId", "requestedUserId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP CONSTRAINT "PK_ad3484f619253191ab55a51daf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD CONSTRAINT "PK_012d225e3c8ec3a5046e4a76bee" PRIMARY KEY ("id", "user2Id")`,
    );
    await queryRunner.query(`ALTER TABLE "friendship" DROP COLUMN "user1Id"`);
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD "user1Id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP CONSTRAINT "PK_012d225e3c8ec3a5046e4a76bee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD CONSTRAINT "PK_ad3484f619253191ab55a51daf4" PRIMARY KEY ("id", "user2Id", "user1Id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP CONSTRAINT "PK_ad3484f619253191ab55a51daf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD CONSTRAINT "PK_b82297c7f7cbf3a1a0562f9b8ed" PRIMARY KEY ("id", "user1Id")`,
    );
    await queryRunner.query(`ALTER TABLE "friendship" DROP COLUMN "user2Id"`);
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD "user2Id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP CONSTRAINT "PK_b82297c7f7cbf3a1a0562f9b8ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD CONSTRAINT "PK_ad3484f619253191ab55a51daf4" PRIMARY KEY ("id", "user1Id", "user2Id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP COLUMN "conversationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD "conversationId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "ownerId"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "ownerId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "postId"`);
    await queryRunner.query(`ALTER TABLE "comment" ADD "postId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "creatorId"`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD "creatorId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "groupId"`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD "groupId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "session" ADD "userId" uuid NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD "userId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "groupId"`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD "groupId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "creatorId"`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD "creatorId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "postId"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "postId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "ownerId"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "ownerId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP COLUMN "conversationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD "conversationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP CONSTRAINT "PK_ad3484f619253191ab55a51daf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD CONSTRAINT "PK_b82297c7f7cbf3a1a0562f9b8ed" PRIMARY KEY ("id", "user1Id")`,
    );
    await queryRunner.query(`ALTER TABLE "friendship" DROP COLUMN "user2Id"`);
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD "user2Id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP CONSTRAINT "PK_b82297c7f7cbf3a1a0562f9b8ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD CONSTRAINT "PK_ad3484f619253191ab55a51daf4" PRIMARY KEY ("id", "user2Id", "user1Id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP CONSTRAINT "PK_ad3484f619253191ab55a51daf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD CONSTRAINT "PK_012d225e3c8ec3a5046e4a76bee" PRIMARY KEY ("id", "user2Id")`,
    );
    await queryRunner.query(`ALTER TABLE "friendship" DROP COLUMN "user1Id"`);
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD "user1Id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP CONSTRAINT "PK_012d225e3c8ec3a5046e4a76bee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD CONSTRAINT "PK_ad3484f619253191ab55a51daf4" PRIMARY KEY ("id", "user1Id", "user2Id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "PK_381b87c8d3d64a2b6114dfe2dec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "PK_d5a6c973b9f2a7ba22f0e67354b" PRIMARY KEY ("requesterUserId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP COLUMN "requestedUserId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD "requestedUserId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "PK_d5a6c973b9f2a7ba22f0e67354b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "PK_381b87c8d3d64a2b6114dfe2dec" PRIMARY KEY ("requestedUserId", "requesterUserId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "PK_381b87c8d3d64a2b6114dfe2dec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "PK_70e51c6645a79339c1e65124c26" PRIMARY KEY ("requestedUserId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP COLUMN "requesterUserId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD "requesterUserId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "PK_70e51c6645a79339c1e65124c26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "PK_381b87c8d3d64a2b6114dfe2dec" PRIMARY KEY ("requesterUserId", "requestedUserId")`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "ownerId"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "ownerId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP COLUMN "conversationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD "conversationId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "assetId"`);
    await queryRunner.query(
      `ALTER TABLE "message" ADD "assetId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "message" ADD "userId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "conversationId"`);
    await queryRunner.query(
      `ALTER TABLE "group" ADD "conversationId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "ownerId"`);
    await queryRunner.query(
      `ALTER TABLE "group" ADD "ownerId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" DROP CONSTRAINT "PK_9cd83b6cfd264fcd25d6eb4a132"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" ADD CONSTRAINT "PK_b1411f07fafcd5ad93c6ee16424" PRIMARY KEY ("groupId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" ADD "userId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" DROP CONSTRAINT "PK_b1411f07fafcd5ad93c6ee16424"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_membership" ADD CONSTRAINT "PK_9cd83b6cfd264fcd25d6eb4a132" PRIMARY KEY ("groupId", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "PK_e2e0bb2dc9b8bbd766eee60aeba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "PK_b100536f62259b7aa3733175e53" PRIMARY KEY ("followerId")`,
    );
    await queryRunner.query(`ALTER TABLE "follower" DROP COLUMN "followedId"`);
    await queryRunner.query(
      `ALTER TABLE "follower" ADD "followedId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "PK_b100536f62259b7aa3733175e53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "PK_e2e0bb2dc9b8bbd766eee60aeba" PRIMARY KEY ("followedId", "followerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "PK_e2e0bb2dc9b8bbd766eee60aeba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "PK_77006d7580f807db59887bca894" PRIMARY KEY ("followedId")`,
    );
    await queryRunner.query(`ALTER TABLE "follower" DROP COLUMN "followerId"`);
    await queryRunner.query(
      `ALTER TABLE "follower" ADD "followerId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "PK_77006d7580f807db59887bca894"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "PK_e2e0bb2dc9b8bbd766eee60aeba" PRIMARY KEY ("followerId", "followedId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "code_snippet" DROP COLUMN "projectId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "code_snippet" ADD "projectId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD "projectId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD "accessType" integer NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "project-user-access"`);
  }
}
