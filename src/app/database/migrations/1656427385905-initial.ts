import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1656427385905 implements MigrationInterface {
    name = 'initial1656427385905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `order` ADD `phone_number` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `order` DROP COLUMN `phone_number`");
    }

}
