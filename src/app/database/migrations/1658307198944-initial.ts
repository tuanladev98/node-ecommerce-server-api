import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1658307198944 implements MigrationInterface {
    name = 'initial1658307198944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`message\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`sender\` enum ('ADMIN', 'CLIENT') NOT NULL, \`message_type\` enum ('TEXT') NOT NULL DEFAULT 'TEXT', \`text\` text NULL, \`seen\` tinyint NOT NULL COMMENT '0 is false, 1 is true' DEFAULT '0', \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_54ce30caeb3f33d68398ea10376\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_54ce30caeb3f33d68398ea10376\``);
        await queryRunner.query(`DROP TABLE \`message\``);
    }

}
