import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1658126675370 implements MigrationInterface {
    name = 'initial1658126675370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `order` ADD `ghn_province_id` int NOT NULL");
        await queryRunner.query("ALTER TABLE `order` ADD `ghn_district_id` int NOT NULL");
        await queryRunner.query("ALTER TABLE `order` ADD `ghn_ward_id` int NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `order` DROP COLUMN `ghn_ward_id`");
        await queryRunner.query("ALTER TABLE `order` DROP COLUMN `ghn_district_id`");
        await queryRunner.query("ALTER TABLE `order` DROP COLUMN `ghn_province_id`");
    }

}
