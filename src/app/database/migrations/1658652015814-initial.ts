import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1658652015814 implements MigrationInterface {
    name = 'initial1658652015814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('PROCESSING', 'PREPARING_SHIPMENT', 'DELIVERED') NOT NULL DEFAULT 'PROCESSING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('WAITING_CONFIRM', 'PROCESSING', 'DELIVERY') NOT NULL DEFAULT 'WAITING_CONFIRM'`);
    }

}
