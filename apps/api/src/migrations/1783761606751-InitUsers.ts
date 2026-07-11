import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUsers1783761606751 implements MigrationInterface {
    name = 'InitUsers1783761606751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "email" character varying(255) NOT NULL, "passwordHash" character varying NOT NULL, "role" character varying(20) NOT NULL DEFAULT 'buyer', "avatarUrl" character varying, "blocked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
