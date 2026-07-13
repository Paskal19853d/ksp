import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVideos1783858963272 implements MigrationInterface {
    name = 'AddVideos1783858963272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTE: same recurring spurious searchVector DROP/re-CREATE as in prior
        // migrations touching unrelated tables — stripped out.
        await queryRunner.query(`CREATE TABLE "videos" ("id" SERIAL NOT NULL, "authorId" integer NOT NULL, "videoUrl" character varying(500) NOT NULL, "thumbnailUrl" character varying(500) NOT NULL DEFAULT '', "caption" text NOT NULL DEFAULT '', "productId" integer, "status" character varying(20) NOT NULL DEFAULT 'published', "likesCount" integer NOT NULL DEFAULT '0', "commentsCount" integer NOT NULL DEFAULT '0', "viewsCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_59cc9ca3e16600f440f0cce1f9" ON "videos" ("authorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ece1558efc6efd53eb530479db" ON "videos" ("status") `);
        await queryRunner.query(`CREATE TABLE "video_comments" ("id" SERIAL NOT NULL, "videoId" integer NOT NULL, "authorId" integer NOT NULL, "text" character varying(500) NOT NULL, "likesCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bfe25ab13a4b2e47a3da9b3302a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2ba4e7417c624e7112b5fff002" ON "video_comments" ("videoId") `);
        await queryRunner.query(`CREATE TABLE "video_likes" ("id" SERIAL NOT NULL, "videoId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_59243e1d607e52320fa12fb5e2e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cb4a4539c335f750754150758b" ON "video_likes" ("videoId", "userId") `);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_59cc9ca3e16600f440f0cce1f9e" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_4e93b7c54da94d17a808db66777" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_comments" ADD CONSTRAINT "FK_2ba4e7417c624e7112b5fff0021" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_comments" ADD CONSTRAINT "FK_0794573e54764e4d1c9f2d49bf8" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_likes" ADD CONSTRAINT "FK_c206da32eee922477cd4fa4fae8" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_likes" ADD CONSTRAINT "FK_fcdcfa1c5a6debf4e0e57c67954" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_likes" DROP CONSTRAINT "FK_fcdcfa1c5a6debf4e0e57c67954"`);
        await queryRunner.query(`ALTER TABLE "video_likes" DROP CONSTRAINT "FK_c206da32eee922477cd4fa4fae8"`);
        await queryRunner.query(`ALTER TABLE "video_comments" DROP CONSTRAINT "FK_0794573e54764e4d1c9f2d49bf8"`);
        await queryRunner.query(`ALTER TABLE "video_comments" DROP CONSTRAINT "FK_2ba4e7417c624e7112b5fff0021"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_4e93b7c54da94d17a808db66777"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_59cc9ca3e16600f440f0cce1f9e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb4a4539c335f750754150758b"`);
        await queryRunner.query(`DROP TABLE "video_likes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2ba4e7417c624e7112b5fff002"`);
        await queryRunner.query(`DROP TABLE "video_comments"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ece1558efc6efd53eb530479db"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_59cc9ca3e16600f440f0cce1f9"`);
        await queryRunner.query(`DROP TABLE "videos"`);
    }

}
