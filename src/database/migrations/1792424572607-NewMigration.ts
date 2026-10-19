import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1792424572607 implements MigrationInterface {
    name = 'NewMigration1792424572607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "sadaqah" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "sadaqah"`);
    }

}
