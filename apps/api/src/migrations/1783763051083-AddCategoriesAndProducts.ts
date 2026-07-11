import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoriesAndProducts1783763051083 implements MigrationInterface {
    name = 'AddCategoriesAndProducts1783763051083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(60) NOT NULL, "icon" character varying(8) NOT NULL, "visible" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "description" text NOT NULL DEFAULT '', "price" integer NOT NULL, "compareAtPrice" integer NOT NULL DEFAULT '0', "imageSeed" character varying(40) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "sku" character varying(30) NOT NULL DEFAULT '', "variants" text array NOT NULL DEFAULT '{}', "active" boolean NOT NULL DEFAULT true, "salesCount" integer NOT NULL DEFAULT '0', "sellerId" integer NOT NULL, "categoryId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e40a1dd2909378f0da1f34f7bd" ON "products" ("sellerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff56834e735fa78a15d0cf2192" ON "products" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_e40a1dd2909378f0da1f34f7bd6" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_e40a1dd2909378f0da1f34f7bd6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff56834e735fa78a15d0cf2192"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e40a1dd2909378f0da1f34f7bd"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
