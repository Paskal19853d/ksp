import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStreamVideoUrl1783881884222 implements MigrationInterface {
    name = 'AddStreamVideoUrl1783881884222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // NOTE: same recurring spurious searchVector DROP/re-CREATE as in prior
        // migrations touching unrelated tables — stripped out.
        await queryRunner.query(`ALTER TABLE "streams" ADD "videoUrl" character varying(500) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "streams" DROP COLUMN "videoUrl"`);
    }

}
