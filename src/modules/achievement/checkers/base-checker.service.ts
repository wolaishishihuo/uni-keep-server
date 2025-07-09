import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, AchievementType } from '@prisma/client';

@Injectable()
export abstract class BaseAchievementChecker {
  constructor(@Inject('PrismaClient') protected prisma: PrismaClient) {}

  abstract checkAchievements(userId: string, context?: any): Promise<string[]>;

  abstract getAchievementType(): AchievementType;

  /**
   * 公共方法：批量更新成就进度
   */
  protected async batchUpdateProgress(
    userId: string,
    progressRules: Record<string, { current: number; target: number }>
  ): Promise<string[]> {
    const unlockedAchievements: string[] = [];

    try {
      // 一次性获取所有相关成就定义和用户成就记录
      const achievementCodes = Object.keys(progressRules);
      const userAchievements = await this.prisma.userAchievement.findMany({
        where: {
          userId,
          achievement: { code: { in: achievementCodes } },
          // 只查询未解锁的
          isUnlocked: false
        },
        include: { achievement: true }
      });

      // 批量更新操作
      const updatePromises = userAchievements.map(async (userAchievement) => {
        const rule = progressRules[userAchievement.achievement.code];
        if (!rule) return null;

        const isNowUnlocked = rule.current >= rule.target;

        await this.prisma.userAchievement.update({
          where: { id: userAchievement.id },
          data: {
            progress: Math.min(rule.current, rule.target),
            isUnlocked: isNowUnlocked,
            unlockedAt: isNowUnlocked ? new Date() : null
          }
        });

        return isNowUnlocked ? userAchievement.achievement.code : null;
      });

      // 并行执行所有更新
      const results = await Promise.all(updatePromises);
      unlockedAchievements.push(...results.filter(Boolean));

      return unlockedAchievements;
    } catch (error) {
      console.error('批量更新成就进度失败:', error.message);
      return [];
    }
  }

  /**
   * 公共方法：获取用户特定类型的未解锁成就
   */
  protected async getUserUnlockedAchievements(userId: string, type: AchievementType) {
    return this.prisma.userAchievement.findMany({
      where: {
        userId,
        achievement: { type },
        isUnlocked: false
      },
      include: { achievement: true }
    });
  }
}
