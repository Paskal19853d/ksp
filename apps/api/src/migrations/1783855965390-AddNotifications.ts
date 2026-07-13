import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotifications1783855965390 implements MigrationInterface {
    name = 'AddNotifications1783855965390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTE: same recurring spurious searchVector DROP/re-CREATE as in prior
        // migrations touching unrelated tables — stripped out.
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "recipientId" integer NOT NULL, "type" character varying(20) NOT NULL, "title" character varying(200) NOT NULL, "body" character varying(500) NOT NULL DEFAULT '', "link" character varying(300), "read" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_db873ba9a123711a4bff527ccd" ON "notifications" ("recipientId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f8b7ed75170d2d7dca4477cc94" ON "notifications" ("read") `);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_db873ba9a123711a4bff527ccd5" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_db873ba9a123711a4bff527ccd5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f8b7ed75170d2d7dca4477cc94"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_db873ba9a123711a4bff527ccd"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
