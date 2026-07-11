import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrders1783771655253 implements MigrationInterface {
    name = 'AddOrders1783771655253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "orderNo" character varying(20) NOT NULL, "buyerId" integer NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'new', "sum" integer NOT NULL, "recipientName" character varying(120) NOT NULL, "recipientPhone" character varying(20) NOT NULL, "city" character varying(100) NOT NULL, "address" character varying(200) NOT NULL, "deliveryMethod" character varying(30) NOT NULL, "paymentMethod" character varying(30) NOT NULL, "returnReason" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9e116d4adfd60229dc662a81b03" UNIQUE ("orderNo"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9877ffd9a491c3e82f5b32d4f4" ON "orders" ("buyerId") `);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "productId" integer NOT NULL, "productName" character varying(200) NOT NULL, "price" integer NOT NULL, "qty" integer NOT NULL, "sellerId" integer NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1200397d761353a3a79f593b9e" ON "order_items" ("sellerId") `);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_9877ffd9a491c3e82f5b32d4f4d" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_9877ffd9a491c3e82f5b32d4f4d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1200397d761353a3a79f593b9e"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9877ffd9a491c3e82f5b32d4f4"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
