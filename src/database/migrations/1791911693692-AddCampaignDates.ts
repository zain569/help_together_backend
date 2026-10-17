import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCampaignDates1791911693692 implements MigrationInterface {
    name = 'AddCampaignDates1791911693692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "startDate" date`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "endDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "startDate"`);
    }

}
