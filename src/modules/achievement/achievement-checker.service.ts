import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getContinuousFastingDays } from '../../modules/user/user.utils';

@Injectable()
export class AchievementCheckerService {
  constructor(@Inject('PrismaClient') private prisma: PrismaClient) {}

  /**
   * 检查并解锁断食相关成就
   */
  async checkFastingAchievements(userId: string): Promise<string[]> {
    const unlockedAchievements: string[] = [];

    // 获取用户断食数据
    const [completedRecords, totalCount] = await Promise.all([
      this.prisma.fastingRecord.findMany({
        where: { userId, status: 'completed' },
        orderBy: { date: 'desc' }
      }),
      this.prisma.fastingRecord.count({
        where: { userId, status: 'completed' }
      })
    ]);

    const consecutiveDays = getContinuousFastingDays(completedRecords);
    const maxHours = Math.max(...completedRecords.map((r) => Number(r.actualHours)), 0);

    // 进度规则映射
    const progressRules = {
      first_fast: { current: totalCount, target: 1 },
      fast_7_days: { current: consecutiveDays, target: 7 },
      fast_30_days: { current: consecutiveDays, target: 30 },
      fast_100_days: { current: totalCount, target: 100 },
      long_fast_18h: { current: maxHours >= 18 ? 1 : 0, target: 1 },
      long_fast_24h: { current: maxHours >= 24 ? 1 : 0, target: 1 }
    };

    // 🚀 批量更新进度
    const newlyUnlocked = await this.batchUpdateProgress(userId, progressRules);
    unlockedAchievements.push(...newlyUnlocked);

    return unlockedAchievements;
  }

  /**
   * 检查并解锁体重相关成就
   */
  async checkWeightAchievements(userId: string): Promise<string[]> {
    const unlockedAchievements: string[] = [];

    // 获取用户体重数据
    const [weightRecords, user] = await Promise.all([
      this.prisma.weightRecord.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { targetWeight: true, currentWeight: true }
      })
    ]);

    if (!weightRecords.length) return unlockedAchievements;

    const firstWeight = weightRecords[weightRecords.length - 1]?.weight;
    const currentWeight = weightRecords[0]?.weight;
    const weightLoss = firstWeight && currentWeight ? Number(firstWeight) - Number(currentWeight) : 0;
    const isTargetReached =
      user?.targetWeight && currentWeight ? Number(currentWeight) <= Number(user.targetWeight) : false;

    // 进度规则映射
    const progressRules = {
      first_weight_record: { current: weightRecords.length, target: 1 },
      weight_loss_1kg: { current: Math.floor(weightLoss * 10) / 10, target: 1 },
      weight_loss_5kg: { current: Math.floor(weightLoss * 10) / 10, target: 5 },
      weight_loss_10kg: { current: Math.floor(weightLoss * 10) / 10, target: 10 },
      reach_target_weight: { current: isTargetReached ? 1 : 0, target: 1 }
    };

    // 🚀 批量更新进度
    const newlyUnlocked = await this.batchUpdateProgress(userId, progressRules);
    unlockedAchievements.push(...newlyUnlocked);

    return unlockedAchievements;
  }

  /**
   * 批量更新成就进度（性能优化）
   */
  private async batchUpdateProgress(
    userId: string,
    progressRules: Record<string, { current: number; target: number }>
  ): Promise<string[]> {
    const unlockedAchievements: string[] = [];

    try {
      // 🚀 一次性获取所有相关成就定义和用户成就记录
      const achievementCodes = Object.keys(progressRules);
      const [achievements, userAchievements] = await Promise.all([
        this.prisma.achievementDefinition.findMany({
          where: { code: { in: achievementCodes } }
        }),
        this.prisma.userAchievement.findMany({
          where: {
            userId,
            achievement: { code: { in: achievementCodes } },
            isUnlocked: false // 只查询未解锁的
          },
          include: { achievement: true }
        })
      ]);

      // 🚀 批量更新操作
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

      // 🚀 并行执行所有更新
      const results = await Promise.all(updatePromises);
      unlockedAchievements.push(...results.filter(Boolean));

      return unlockedAchievements;
    } catch (error) {
      console.error('批量更新成就进度失败:', error.message);
      return [];
    }
  }
}
