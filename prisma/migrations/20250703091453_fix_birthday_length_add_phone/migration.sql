/*
  Warnings:

  - You are about to drop the column `type` on the `system_configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `system_configs` DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `phone` VARCHAR(11) NULL,
    MODIFY `birthday` VARCHAR(100) NULL;
