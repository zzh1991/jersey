-- CreateTable
CREATE TABLE `jerseys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `jerseyType` ENUM('PLAYER', 'FAN') NOT NULL,
    `clothingType` ENUM('SHORT_SLEEVE', 'LONG_SLEEVE', 'HALF_ZIP_TRAINING', 'SHORT_TRAINING', 'LONG_TRAINING') NOT NULL,
    `club` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `matchType` ENUM('HOME', 'AWAY_1', 'AWAY_2', 'AWAY_3', 'CUP') NOT NULL,
    `year` INTEGER NOT NULL,
    `season` VARCHAR(20) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `jerseys_name_idx`(`name`),
    INDEX `jerseys_club_idx`(`club`),
    INDEX `jerseys_country_idx`(`country`),
    INDEX `jerseys_likes_idx`(`likes`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jersey_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jerseyId` INTEGER NOT NULL,
    `imageData` LONGBLOB NOT NULL,
    `contentType` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `jersey_images_jerseyId_key`(`jerseyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `jersey_images` ADD CONSTRAINT `jersey_images_jerseyId_fkey` FOREIGN KEY (`jerseyId`) REFERENCES `jerseys`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
