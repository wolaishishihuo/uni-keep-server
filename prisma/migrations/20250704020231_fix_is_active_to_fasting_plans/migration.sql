/*
  Warnings:

  - You are about to alter the column `is_active` on the `fasting_plans` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `fasting_plans` MODIFY `is_active` VARCHAR(191) NOT NULL DEFAULT '0';
