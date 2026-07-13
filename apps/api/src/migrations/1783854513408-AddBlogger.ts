import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBlogger1783854513408 implements MigrationInterface {
    name = 'AddBlogger1783854513408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTE: same recurring spurious searchVector DROP/re-CREATE as in prior
        // migrations touching unrelated tables — stripped out.
        await queryRunner.query(`CREATE TABLE "affiliate_payouts" ("id" SERIAL NOT NULL, "bloggerId" integer NOT NULL, "amount" integer NOT NULL, "periodStart" TIMESTAMP NOT NULL, "periodEnd" TIMESTAMP NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'pending', "paidAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bb16ad268019be269f02c660016" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1fa1f0fa6af3a8be4cfb257a84" ON "affiliate_payouts" ("bloggerId") `);
        await queryRunner.query(`CREATE TABLE "affiliate_links" ("id" SERIAL NOT NULL, "bloggerId" integer NOT NULL, "productId" integer NOT NULL, "code" character varying(60) NOT NULL, "pct" integer NOT NULL, "active" boolean NOT NULL DEFAULT true, "clicks" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_aec82c42f69dc336dd434d16436" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3bde4fc70f058694941ca418d8" ON "affiliate_links" ("bloggerId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b7758b45ff7ef9d9e996a9aea6" ON "affiliate_links" ("code") `);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "bloggerId" integer`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "affiliateCommissionPct" integer`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "affiliatePayoutId" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_63130a9554e848f92c44638a00" ON "order_items" ("bloggerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d38b2ab6219c8453965afde2f4" ON "order_items" ("affiliatePayoutId") `);
        await queryRunner.query(`ALTER TABLE "affiliate_payouts" ADD CONSTRAINT "FK_1fa1f0fa6af3a8be4cfb257a843" FOREIGN KEY ("bloggerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "affiliate_links" ADD CONSTRAINT "FK_3bde4fc70f058694941ca418d8f" FOREIGN KEY ("bloggerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "affiliate_links" ADD CONSTRAINT "FK_0ebf85c3dda62e6b3cc6cd82b9b" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate_links" DROP CONSTRAINT "FK_0ebf85c3dda62e6b3cc6cd82b9b"`);
        await queryRunner.query(`ALTER TABLE "affiliate_links" DROP CONSTRAINT "FK_3bde4fc70f058694941ca418d8f"`);
        await queryRunner.query(`ALTER TABLE "affiliate_payouts" DROP CONSTRAINT "FK_1fa1f0fa6af3a8be4cfb257a843"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d38b2ab6219c8453965afde2f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_63130a9554e848f92c44638a00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "affiliatePayoutId"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "affiliateCommissionPct"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "bloggerId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b7758b45ff7ef9d9e996a9aea6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3bde4fc70f058694941ca418d8"`);
        await queryRunner.query(`DROP TABLE "affiliate_links"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1fa1f0fa6af3a8be4cfb257a84"`);
        await queryRunner.query(`DROP TABLE "affiliate_payouts"`);
        await queryRunner.query(`CREATE INDEX "IDX_products_search_vector" ON "products" ("searchVector") `);
    }

}
