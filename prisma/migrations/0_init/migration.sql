-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `open_id` VARCHAR(100) NOT NULL,
    `union_id` VARCHAR(100) NULL,
    `nickname` VARCHAR(50) NOT NULL,
    `avatar` VARCHAR(255) NULL,
    `height` DECIMAL(5, 2) NULL,
    `target_weight` DECIMAL(5, 2) NULL,
    `current_weight` DECIMAL(5, 2) NULL,
    `gender` ENUM('male', 'female') NULL,
    `age` INTEGER NULL,
    `invite_code` VARCHAR(20) NULL,
    `couple_id` VARCHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `birthday` VARCHAR(10) NULL,

    UNIQUE INDEX `users_open_id_key`(`open_id`),
    UNIQUE INDEX `users_invite_code_key`(`invite_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fasting_plans` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `fasting_hours` INTEGER NOT NULL DEFAULT 16,
    `eating_hours` INTEGER NOT NULL DEFAULT 8,
    `start_time` VARCHAR(8) NOT NULL,
    `end_time` VARCHAR(8) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `fasting_reminder` VARCHAR(8) NULL,

    INDEX `fasting_plans_user_id_idx`(`user_id`),
    INDEX `fasting_plans_user_id_is_active_idx`(`user_id`, `is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fasting_records` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `plan_id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `start_time` VARCHAR(8) NOT NULL,
    `end_time` VARCHAR(8) NULL,
    `actual_hours` DECIMAL(4, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM('active', 'completed', 'broken') NOT NULL DEFAULT 'active',
    `break_reason` VARCHAR(200) NULL,
    `mood_before` ENUM('excited', 'normal', 'worried') NULL,
    `mood_after` ENUM('great', 'good', 'tired') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `fasting_records_plan_id_idx`(`plan_id`),
    INDEX `fasting_records_status_idx`(`status`),
    INDEX `fasting_records_user_id_date_idx`(`user_id`, `date`),
    UNIQUE INDEX `fasting_records_user_id_date_key`(`user_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weight_records` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `weight` DECIMAL(5, 2) NOT NULL,
    `date` DATE NOT NULL,
    `mood` ENUM('happy', 'normal', 'sad') NOT NULL DEFAULT 'normal',
    `note` VARCHAR(500) NULL,
    `photo_before` VARCHAR(255) NULL,
    `photo_after` VARCHAR(255) NULL,
    `bmi` DECIMAL(4, 2) NULL,
    `body_fat_rate` DECIMAL(4, 2) NULL,
    `muscle_mass` DECIMAL(5, 2) NULL,
    `record_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `weight_records_user_id_date_idx`(`user_id`, `date`),
    INDEX `weight_records_user_id_weight_date_idx`(`user_id`, `weight`, `date`),
    UNIQUE INDEX `weight_records_user_id_date_key`(`user_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `achievement_definitions` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `type` ENUM('fasting', 'weight', 'couple', 'special', 'consistency') NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` VARCHAR(200) NOT NULL,
    `icon` VARCHAR(100) NOT NULL,
    `rule_config` JSON NULL,
    `points` INTEGER NOT NULL DEFAULT 0,
    `rarity` ENUM('common', 'rare', 'epic', 'legendary') NOT NULL DEFAULT 'common',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `achievement_definitions_code_key`(`code`),
    INDEX `achievement_definitions_type_idx`(`type`),
    INDEX `achievement_definitions_rarity_idx`(`rarity`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_achievements` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `achievement_id` VARCHAR(191) NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `target` INTEGER NOT NULL DEFAULT 1,
    `unlocked_at` DATETIME(3) NULL,
    `is_unlocked` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `user_achievements_user_id_is_unlocked_idx`(`user_id`, `is_unlocked`),
    INDEX `user_achievements_achievement_id_fkey`(`achievement_id`),
    UNIQUE INDEX `user_achievements_user_id_achievement_id_key`(`user_id`, `achievement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `couple_relations` (
    `id` VARCHAR(191) NOT NULL,
    `user1_id` VARCHAR(191) NOT NULL,
    `user2_id` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'active', 'inactive') NOT NULL DEFAULT 'pending',
    `invited_by` VARCHAR(191) NOT NULL,
    `confirmed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `couple_relations_status_idx`(`status`),
    INDEX `couple_relations_invited_by_fkey`(`invited_by`),
    INDEX `couple_relations_user2_id_fkey`(`user2_id`),
    UNIQUE INDEX `couple_relations_user1_id_user2_id_key`(`user1_id`, `user2_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `encouragements` (
    `id` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `receiver_id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(500) NOT NULL,
    `type` ENUM('text', 'emoji', 'achievement') NOT NULL DEFAULT 'text',
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `read_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `encouragements_receiver_id_is_read_idx`(`receiver_id`, `is_read`),
    INDEX `encouragements_sender_id_idx`(`sender_id`),
    INDEX `encouragements_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` ENUM('fasting_reminder', 'achievement_unlock', 'couple_encourage', 'system', 'weight_reminder') NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `content` VARCHAR(500) NOT NULL,
    `template_id` VARCHAR(100) NULL,
    `push_data` JSON NULL,
    `status` ENUM('pending', 'sent', 'failed') NOT NULL DEFAULT 'pending',
    `sent_at` DATETIME(3) NULL,
    `error_message` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_user_id_type_idx`(`user_id`, `type`),
    INDEX `notifications_status_idx`(`status`),
    INDEX `notifications_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_records` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `meal_type` ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    `meal_time` DATETIME(3) NOT NULL,
    `food_items` TEXT NOT NULL,
    `satiety_rating` TINYINT NOT NULL,
    `mood` ENUM('satisfied', 'normal', 'guilty') NOT NULL DEFAULT 'normal',
    `note` VARCHAR(500) NULL,
    `photo` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `food_records_user_id_date_idx`(`user_id`, `date`),
    INDEX `food_records_user_id_meal_type_idx`(`user_id`, `meal_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_configs` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(100) NOT NULL,
    `value` TEXT NOT NULL,
    `description` VARCHAR(200) NULL,
    `type` ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string',
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `system_configs_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fasting_plans` ADD CONSTRAINT `fasting_plans_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fasting_records` ADD CONSTRAINT `fasting_records_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `fasting_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fasting_records` ADD CONSTRAINT `fasting_records_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weight_records` ADD CONSTRAINT `weight_records_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_achievements` ADD CONSTRAINT `user_achievements_achievement_id_fkey` FOREIGN KEY (`achievement_id`) REFERENCES `achievement_definitions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_achievements` ADD CONSTRAINT `user_achievements_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couple_relations` ADD CONSTRAINT `couple_relations_invited_by_fkey` FOREIGN KEY (`invited_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couple_relations` ADD CONSTRAINT `couple_relations_user1_id_fkey` FOREIGN KEY (`user1_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couple_relations` ADD CONSTRAINT `couple_relations_user2_id_fkey` FOREIGN KEY (`user2_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `encouragements` ADD CONSTRAINT `encouragements_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `encouragements` ADD CONSTRAINT `encouragements_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `food_records` ADD CONSTRAINT `food_records_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

