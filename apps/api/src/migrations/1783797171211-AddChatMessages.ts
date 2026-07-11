import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChatMessages1783797171211 implements MigrationInterface {
    name = 'AddChatMessages1783797171211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTE: same recurring spurious searchVector DROP/re-CREATE as in AddStreams —
        // TypeORM's schema diff doesn't fully round-trip the raw-SQL GENERATED ALWAYS
        // column despite the typeorm_metadata row. Stripped out; unrelated to chat.
        await queryRunner.query(`CREATE TABLE "chat_messages" ("id" SERIAL NOT NULL, "streamId" integer NOT NULL, "authorId" integer NOT NULL, "text" character varying(500) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f98d84bf52fe893c2066bed332" ON "chat_messages" ("streamId") `);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_f98d84bf52fe893c2066bed332c" FOREIGN KEY ("streamId") REFERENCES "streams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_fe2f91e973181fcab44f6405815" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_fe2f91e973181fcab44f6405815"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_f98d84bf52fe893c2066bed332c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f98d84bf52fe893c2066bed332"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
    }

}
