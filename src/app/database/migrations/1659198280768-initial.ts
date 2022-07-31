import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1659198280768 implements MigrationInterface {
    name = 'initial1659198280768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`review\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`rating_point\` enum ('1', '2', '3', '4', '5') NOT NULL DEFAULT '5', \`comment\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_26b533e15b5f2334c96339a1f08\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_26b533e15b5f2334c96339a1f08\``);
        await queryRunner.query(`DROP TABLE \`review\``);
    }

}
