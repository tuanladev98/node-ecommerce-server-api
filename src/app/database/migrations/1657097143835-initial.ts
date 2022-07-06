import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1657097143835 implements MigrationInterface {
    name = 'initial1657097143835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bill` ADD CONSTRAINT `FK_440e29faf0744209b41dc243dba` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bill` DROP FOREIGN KEY `FK_440e29faf0744209b41dc243dba`");
    }

}
