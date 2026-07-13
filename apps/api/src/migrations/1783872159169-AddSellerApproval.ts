import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSellerApproval1783872159169 implements MigrationInterface {
    name = 'AddSellerApproval1783872159169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTE: same recurring spurious searchVector DROP/re-CREATE as in prior
        // migrations touching unrelated tables — stripped out.
        await queryRunner.query(`ALTER TABLE "users" ADD "sellerStatus" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "storeCategory" character varying(60)`);
        // Backfill: existing sellers registered before the approval gate existed
        // must not be retroactively locked out of creating products.
        await queryRunner.query(`UPDATE "users" SET "sellerStatus" = 'approved' WHERE "role" = 'seller'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "storeCategory"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "sellerStatus"`);
    }

}
