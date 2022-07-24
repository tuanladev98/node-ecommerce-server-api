import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1658563820230 implements MigrationInterface {
    name = 'initial1658563820230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`ghn_province_id\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`ghn_district_id\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`ghn_ward_id\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`stripe\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`stripe\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`ghn_ward_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`ghn_district_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`ghn_province_id\` int NOT NULL`);
    }

}
