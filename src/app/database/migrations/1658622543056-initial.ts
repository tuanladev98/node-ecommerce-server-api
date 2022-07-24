import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1658622543056 implements MigrationInterface {
    name = 'initial1658622543056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`stripe\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`stripe_succeeded_payment_intent_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`ghn_shipping_code\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`ghn_shipping_code\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`stripe_succeeded_payment_intent_id\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`stripe\` text NULL`);
    }

}
