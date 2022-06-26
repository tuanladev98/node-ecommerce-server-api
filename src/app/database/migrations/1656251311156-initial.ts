import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1656251311156 implements MigrationInterface {
    name = 'initial1656251311156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `m_category` (`id` int NOT NULL AUTO_INCREMENT, `category_name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `product_size` (`product_id` int NOT NULL, `size_id` int NOT NULL, `quantity` int NOT NULL, PRIMARY KEY (`product_id`, `size_id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `product` (`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `code` varchar(255) NOT NULL, `product_name` varchar(255) NOT NULL, `description` text NULL, `price` int NOT NULL, `gender` enum ('MALE', 'FEMALE') NOT NULL DEFAULT 'MALE', `image01` varchar(255) NOT NULL, `image02` varchar(255) NOT NULL, `is_delete` tinyint NOT NULL DEFAULT '0', `category_id` int NOT NULL, UNIQUE INDEX `IDX_99c39b067cfa73c783f0fc49a6` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `role` enum ('CLIENT', 'ADMIN') NOT NULL DEFAULT 'CLIENT', `name` varchar(255) NOT NULL, `gender` enum ('MALE', 'FEMALE') NOT NULL DEFAULT 'MALE', UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `cart` (`id` int NOT NULL AUTO_INCREMENT, `user_id` int NOT NULL, `product_id` int NOT NULL, `size_id` int NOT NULL, `quantity` int NOT NULL, UNIQUE INDEX `IDX_a045e82f15754ce4a160216224` (`user_id`, `product_id`, `size_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `m_size` (`id` int NOT NULL AUTO_INCREMENT, `length` varchar(255) NOT NULL, `eu_size` varchar(255) NULL, `uk_size` varchar(255) NULL, `us_men_size` varchar(255) NULL, `us_women_size` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `bill` (`id` int NOT NULL AUTO_INCREMENT, `order_id` int NOT NULL, `product_id` int NOT NULL, `size_id` int NOT NULL, `quantity` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `order` (`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `order_code` varchar(255) NOT NULL, `amount` int NOT NULL, `user_id` int NOT NULL, `receiver` varchar(255) NOT NULL, `address` varchar(255) NOT NULL, `province` varchar(255) NOT NULL, `district` varchar(255) NOT NULL, `ward` varchar(255) NOT NULL, `status` enum ('WAITING_CONFIRM', 'PROCESSING', 'DELIVERY') NOT NULL DEFAULT 'WAITING_CONFIRM', UNIQUE INDEX `IDX_3978b8ace86860e3283a839e53` (`order_code`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `product_size` ADD CONSTRAINT `FK_2c5c35c613e3e028e211821f7b9` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `product_size` ADD CONSTRAINT `FK_bcc87f36de7c673f3d0f5a0782d` FOREIGN KEY (`size_id`) REFERENCES `m_size`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `product` ADD CONSTRAINT `FK_0dce9bc93c2d2c399982d04bef1` FOREIGN KEY (`category_id`) REFERENCES `m_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `cart` ADD CONSTRAINT `FK_f091e86a234693a49084b4c2c86` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `cart` ADD CONSTRAINT `FK_dccd1ec2d6f5644a69adf163bc1` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `cart` ADD CONSTRAINT `FK_48b9658e0ab43e7df492f644772` FOREIGN KEY (`size_id`) REFERENCES `m_size`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `bill` ADD CONSTRAINT `FK_8f8fa9c4a20b839a9272d908b87` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `bill` ADD CONSTRAINT `FK_b58e55913a47774f7d31e964b1e` FOREIGN KEY (`size_id`) REFERENCES `m_size`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bill` DROP FOREIGN KEY `FK_b58e55913a47774f7d31e964b1e`");
        await queryRunner.query("ALTER TABLE `bill` DROP FOREIGN KEY `FK_8f8fa9c4a20b839a9272d908b87`");
        await queryRunner.query("ALTER TABLE `cart` DROP FOREIGN KEY `FK_48b9658e0ab43e7df492f644772`");
        await queryRunner.query("ALTER TABLE `cart` DROP FOREIGN KEY `FK_dccd1ec2d6f5644a69adf163bc1`");
        await queryRunner.query("ALTER TABLE `cart` DROP FOREIGN KEY `FK_f091e86a234693a49084b4c2c86`");
        await queryRunner.query("ALTER TABLE `product` DROP FOREIGN KEY `FK_0dce9bc93c2d2c399982d04bef1`");
        await queryRunner.query("ALTER TABLE `product_size` DROP FOREIGN KEY `FK_bcc87f36de7c673f3d0f5a0782d`");
        await queryRunner.query("ALTER TABLE `product_size` DROP FOREIGN KEY `FK_2c5c35c613e3e028e211821f7b9`");
        await queryRunner.query("DROP INDEX `IDX_3978b8ace86860e3283a839e53` ON `order`");
        await queryRunner.query("DROP TABLE `order`");
        await queryRunner.query("DROP TABLE `bill`");
        await queryRunner.query("DROP TABLE `m_size`");
        await queryRunner.query("DROP INDEX `IDX_a045e82f15754ce4a160216224` ON `cart`");
        await queryRunner.query("DROP TABLE `cart`");
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP INDEX `IDX_99c39b067cfa73c783f0fc49a6` ON `product`");
        await queryRunner.query("DROP TABLE `product`");
        await queryRunner.query("DROP TABLE `product_size`");
        await queryRunner.query("DROP TABLE `m_category`");
    }

}
