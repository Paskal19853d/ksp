import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReports1783840627514 implements MigrationInterface {
    name = 'AddReports1783840627514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTE: same recurring spurious searchVector DROP/re-CREATE as in prior
        // migrations touching unrelated tables — stripped out.
        await queryRunner.query(`CREATE TABLE "reports" ("id" SERIAL NOT NULL, "targetType" character varying(20) NOT NULL, "targetId" integer NOT NULL, "reporterId" integer NOT NULL, "reason" character varying(500) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'pending', "resolvedById" integer, "resolvedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7220992f98b6ba4a1389548692" ON "reports" ("targetType") `);
        await queryRunner.query(`CREATE INDEX "IDX_cd7faa31851a2153125fd1af73" ON "reports" ("targetId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dab4d78b3be05c1ca4a626f57f" ON "reports" ("status") `);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_4353be8309ce86650def2f8572d" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_4353be8309ce86650def2f8572d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dab4d78b3be05c1ca4a626f57f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd7faa31851a2153125fd1af73"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7220992f98b6ba4a1389548692"`);
        await queryRunner.query(`DROP TABLE "reports"`);
    }

}
