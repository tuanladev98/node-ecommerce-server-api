import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1657096575978 implements MigrationInterface {
    name = 'initial1657096575978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `order` ADD CONSTRAINT `FK_199e32a02ddc0f47cd93181d8fd` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `order` DROP FOREIGN KEY `FK_199e32a02ddc0f47cd93181d8fd`");
    }

}
