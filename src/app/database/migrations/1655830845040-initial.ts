import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1655830845040 implements MigrationInterface {
    name = 'initial1655830845040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `product` CHANGE `title` `product_name` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `product` CHANGE `product_name` `title` varchar(255) NOT NULL");
    }

}
