import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCmsAndMarketing1783836752355 implements MigrationInterface {
    name = 'AddCmsAndMarketing1783836752355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTE: same recurring spurious searchVector DROP/re-CREATE as in
        // AddStreams/AddChatMessages — stripped out, unrelated to CMS/marketing.
        await queryRunner.query(`CREATE TABLE "banners" ("id" SERIAL NOT NULL, "title" character varying(150) NOT NULL, "subtitle" character varying(250) NOT NULL DEFAULT '', "imageUrl" character varying(500) NOT NULL, "link" character varying(300) NOT NULL, "active" boolean NOT NULL DEFAULT true, "clicks" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ad_campaigns" ("id" SERIAL NOT NULL, "sellerId" integer NOT NULL, "productId" integer NOT NULL, "budget" integer NOT NULL, "spent" integer NOT NULL DEFAULT '0', "clicks" integer NOT NULL DEFAULT '0', "status" character varying(20) NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7877713eb87f782dd190eed85a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_75131ed22b8d3249f5b6c057a7" ON "ad_campaigns" ("sellerId") `);
        await queryRunner.query(`CREATE TABLE "pages" ("id" SERIAL NOT NULL, "title" character varying(150) NOT NULL, "slug" character varying(100) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'draft', "content" jsonb NOT NULL DEFAULT '[]', "authorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fe66ca6a86dc94233e5d778953" ON "pages" ("slug") `);
        await queryRunner.query(`ALTER TABLE "ad_campaigns" ADD CONSTRAINT "FK_75131ed22b8d3249f5b6c057a77" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ad_campaigns" ADD CONSTRAINT "FK_fe763459fefb02b2002bc923133" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad_campaigns" DROP CONSTRAINT "FK_fe763459fefb02b2002bc923133"`);
        await queryRunner.query(`ALTER TABLE "ad_campaigns" DROP CONSTRAINT "FK_75131ed22b8d3249f5b6c057a77"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe66ca6a86dc94233e5d778953"`);
        await queryRunner.query(`DROP TABLE "pages"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75131ed22b8d3249f5b6c057a7"`);
        await queryRunner.query(`DROP TABLE "ad_campaigns"`);
        await queryRunner.query(`DROP TABLE "banners"`);
    }

}
