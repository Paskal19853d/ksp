import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReviews1783772188499 implements MigrationInterface {
    name = 'AddReviews1783772188499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "orderItemId" integer NOT NULL, "authorId" integer NOT NULL, "productId" integer NOT NULL, "sellerId" integer NOT NULL, "rating" integer NOT NULL, "text" text NOT NULL, "reply" character varying(1000), "repliedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1e6c554d615dd5a5bf0e11ee0e9" UNIQUE ("orderItemId"), CONSTRAINT "REL_1e6c554d615dd5a5bf0e11ee0e" UNIQUE ("orderItemId"), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48770372f891b9998360e4434f" ON "reviews" ("authorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a6b3c434392f5d10ec17104366" ON "reviews" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9805ee71aa117dee3c3f60f527" ON "reviews" ("sellerId") `);
        await queryRunner.query(`ALTER TABLE "products" ADD "rating" numeric(2,1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "reviewCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_1e6c554d615dd5a5bf0e11ee0e9" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_48770372f891b9998360e4434f3" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_a6b3c434392f5d10ec171043666"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_48770372f891b9998360e4434f3"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_1e6c554d615dd5a5bf0e11ee0e9"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "reviewCount"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "rating"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9805ee71aa117dee3c3f60f527"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a6b3c434392f5d10ec17104366"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48770372f891b9998360e4434f"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
    }

}
