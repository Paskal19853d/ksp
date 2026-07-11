import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductSearchVector1783787978510 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // "simple" config: no language-specific stemming dictionary ships for Ukrainian —
        // this still tokenizes/lowercases/dedupes correctly, just without stemming.
        await queryRunner.query(`
            ALTER TABLE "products"
            ADD COLUMN "searchVector" tsvector
            GENERATED ALWAYS AS (
                setweight(to_tsvector('simple', coalesce("name", '')), 'A') ||
                setweight(to_tsvector('simple', coalesce("description", '')), 'B') ||
                setweight(to_tsvector('simple', coalesce("sku", '')), 'C')
            ) STORED
        `);
        await queryRunner.query(
            `CREATE INDEX "IDX_products_search_vector" ON "products" USING GIN ("searchVector")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_products_search_vector"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "searchVector"`);
    }

}
