import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1659187784359 implements MigrationInterface {
    name = 'initial1659187784359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`wishlist\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`is_favorite\` tinyint NOT NULL COMMENT '0 is false, 1 is true' DEFAULT '0', \`user_id\` int NOT NULL, \`product_id\` int NOT NULL, PRIMARY KEY (\`user_id\`, \`product_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`wishlist\` ADD CONSTRAINT \`FK_512bf776587ad5fc4f804277d76\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wishlist\` ADD CONSTRAINT \`FK_16f64e06715ce4fea8257cc42c5\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wishlist\` DROP FOREIGN KEY \`FK_16f64e06715ce4fea8257cc42c5\``);
        await queryRunner.query(`ALTER TABLE \`wishlist\` DROP FOREIGN KEY \`FK_512bf776587ad5fc4f804277d76\``);
        await queryRunner.query(`DROP TABLE \`wishlist\``);
    }

}
