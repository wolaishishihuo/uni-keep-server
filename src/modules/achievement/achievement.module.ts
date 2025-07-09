import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { FastingChecker } from './checkers/fasting-checker.service';
import { WeightChecker } from './checkers/weight-checker.service';

@Module({
  controllers: [AchievementController],
  providers: [AchievementService, FastingChecker, WeightChecker],
  exports: [AchievementService]
})
export class AchievementModule {}
