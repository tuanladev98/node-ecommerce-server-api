import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1655830609817 implements MigrationInterface {
    name = 'initial1655830609817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `product` ADD `code` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `product` ADD UNIQUE INDEX `IDX_99c39b067cfa73c783f0fc49a6` (`code`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `product` DROP INDEX `IDX_99c39b067cfa73c783f0fc49a6`");
        await queryRunner.query("ALTER TABLE `product` DROP COLUMN `code`");
    }

}
