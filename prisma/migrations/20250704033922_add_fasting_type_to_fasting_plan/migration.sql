-- AlterTable
ALTER TABLE `fasting_plans` ADD COLUMN `fasting_type` ENUM('TIME_16_8', 'TIME_18_6', 'CUSTOM') NOT NULL DEFAULT 'TIME_16_8';
