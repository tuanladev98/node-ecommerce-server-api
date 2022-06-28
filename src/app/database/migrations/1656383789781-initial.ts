import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1656383789781 implements MigrationInterface {
    name = 'initial1656383789781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `order` ADD `postcode` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `order` ADD `note` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `order` DROP COLUMN `note`");
        await queryRunner.query("ALTER TABLE `order` DROP COLUMN `postcode`");
    }

}
