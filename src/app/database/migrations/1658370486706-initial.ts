import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1658370486706 implements MigrationInterface {
    name = 'initial1658370486706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`user_color\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`user_color\``);
    }

}
