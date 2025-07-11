-- AlterTable
ALTER TABLE `fasting_plans` MODIFY `start_time` VARCHAR(19) NOT NULL,
    MODIFY `end_time` VARCHAR(19) NOT NULL,
    MODIFY `fasting_reminder` VARCHAR(19) NULL;

-- AlterTable
ALTER TABLE `fasting_records` MODIFY `start_time` VARCHAR(100) NOT NULL,
    MODIFY `end_time` VARCHAR(100) NULL;
