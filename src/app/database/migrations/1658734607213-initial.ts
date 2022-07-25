import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1658734607213 implements MigrationInterface {
    name = 'initial1658734607213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_log\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`log_type\` enum ('LOGIN') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_log\` ADD CONSTRAINT \`FK_86d86e827a8e203ef7d390e081e\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_log\` DROP FOREIGN KEY \`FK_86d86e827a8e203ef7d390e081e\``);
        await queryRunner.query(`DROP TABLE \`user_log\``);
    }

}
