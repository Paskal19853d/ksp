import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStreams1783795495189 implements MigrationInterface {
    name = 'AddStreams1783795495189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTE: TypeORM's schema diff generated spurious DROP/re-CREATE statements for
        // products.searchVector (a raw-SQL GENERATED ALWAYS column from an earlier
        // migration, which TypeORM's introspection doesn't fully round-trip) — removed
        // from this migration since Streams doesn't touch that column at all.
        await queryRunner.query(`CREATE TABLE "streams" ("id" SERIAL NOT NULL, "hostId" integer NOT NULL, "title" character varying(150) NOT NULL, "description" text NOT NULL DEFAULT '', "status" character varying(20) NOT NULL DEFAULT 'scheduled', "productIds" integer array NOT NULL DEFAULT '{}', "scheduledAt" TIMESTAMP, "startedAt" TIMESTAMP, "endedAt" TIMESTAMP, "peakViewers" integer NOT NULL DEFAULT '0', "ordersCount" integer NOT NULL DEFAULT '0', "income" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40440b6f569ebc02bc71c25c499" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a4af9849a12d92b21f85c2d19c" ON "streams" ("hostId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0081af4f9687bd03cbd628ed49" ON "streams" ("status") `);
        await queryRunner.query(`ALTER TABLE "streams" ADD CONSTRAINT "FK_a4af9849a12d92b21f85c2d19c2" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "streams" DROP CONSTRAINT "FK_a4af9849a12d92b21f85c2d19c2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0081af4f9687bd03cbd628ed49"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a4af9849a12d92b21f85c2d19c"`);
        await queryRunner.query(`DROP TABLE "streams"`);
    }

}
