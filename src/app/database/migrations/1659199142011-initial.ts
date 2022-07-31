import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1659199142011 implements MigrationInterface {
    name = 'initial1659199142011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`review\` ADD \`title\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`review\` DROP COLUMN \`title\``);
    }

}
