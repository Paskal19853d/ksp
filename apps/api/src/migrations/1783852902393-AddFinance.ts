import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFinance1783852902393 implements MigrationInterface {
    name = 'AddFinance1783852902393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTE: same recurring spurious searchVector DROP/re-CREATE as in prior
        // migrations touching unrelated tables — stripped out.
        await queryRunner.query(`CREATE TABLE "payouts" ("id" SERIAL NOT NULL, "sellerId" integer NOT NULL, "gmv" integer NOT NULL, "commission" integer NOT NULL, "netAmount" integer NOT NULL, "periodStart" TIMESTAMP NOT NULL, "periodEnd" TIMESTAMP NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'pending', "paidAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_76855dc4f0a6c18c72eea302e87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6ca8230c219d7050caf7cb9aa1" ON "payouts" ("sellerId") `);
        await queryRunner.query(`CREATE TABLE "commission_rules" ("id" SERIAL NOT NULL, "categoryId" integer NOT NULL, "pct" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1da46866baaa826fb3a6a8d6f1c" UNIQUE ("categoryId"), CONSTRAINT "REL_1da46866baaa826fb3a6a8d6f1" UNIQUE ("categoryId"), CONSTRAINT "PK_399c9fa57f7fd28dfc57acea3bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "commissionPct" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "payoutId" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_36da7e286f13b72480e9574873" ON "order_items" ("payoutId") `);
        await queryRunner.query(`ALTER TABLE "payouts" ADD CONSTRAINT "FK_6ca8230c219d7050caf7cb9aa1d" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commission_rules" ADD CONSTRAINT "FK_1da46866baaa826fb3a6a8d6f1c" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commission_rules" DROP CONSTRAINT "FK_1da46866baaa826fb3a6a8d6f1c"`);
        await queryRunner.query(`ALTER TABLE "payouts" DROP CONSTRAINT "FK_6ca8230c219d7050caf7cb9aa1d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_36da7e286f13b72480e9574873"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "payoutId"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "commissionPct"`);
        await queryRunner.query(`DROP TABLE "commission_rules"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ca8230c219d7050caf7cb9aa1"`);
        await queryRunner.query(`DROP TABLE "payouts"`);
    }

}
