import { Injectable } from '@nestjs/common';
import { FastingChecker } from './checkers/fasting-checker.service';
import { WeightChecker } from './checkers/weight-checker.service';

@Injectable()
export class AchievementService {
  constructor(
    private fastingChecker: FastingChecker,
    private weightChecker: WeightChecker
  ) {}

  /**
   * 检查断食相关成就
   */
  async checkFastingAchievements(userId: string): Promise<string[]> {
    return this.fastingChecker.checkAchievements(userId);
  }

  /**
   * 检查体重相关成就
   */
  async checkWeightAchievements(userId: string): Promise<string[]> {
    return this.weightChecker.checkAchievements(userId);
  }

  /**
   * 检查所有成就（可选，用于用户登录时）
   */
  async checkAllAchievements(userId: string): Promise<string[]> {
    const [fastingAchievements, weightAchievements] = await Promise.all([
      this.fastingChecker.checkAchievements(userId),
      this.weightChecker.checkAchievements(userId)
    ]);

    return [...fastingAchievements, ...weightAchievements];
  }

  /**
   * 获取所有检查器类型（用于调试）
   */
  getCheckerTypes(): string[] {
    return [this.fastingChecker.getAchievementType(), this.weightChecker.getAchievementType()];
  }
}
