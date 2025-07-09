import { Injectable } from '@nestjs/common';
import { AchievementType } from '@prisma/client';
import { BaseAchievementChecker } from './base-checker.service';

@Injectable()
export class WeightChecker extends BaseAchievementChecker {
  /**
   * 实现抽象方法：检查体重成就
   */
  async checkAchievements(userId: string): Promise<string[]> {
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

    if (!weightRecords.length) return [];

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

    // 使用父类的批量更新方法
    return await this.batchUpdateProgress(userId, progressRules);
  }

  /**
   * 实现抽象方法：返回成就类型
   */
  getAchievementType(): AchievementType {
    return AchievementType.weight;
  }
}
