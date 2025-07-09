import { Injectable } from '@nestjs/common';
import { AchievementType } from '@prisma/client';
import { BaseAchievementChecker } from './base-checker.service';
import { getContinuousFastingDays } from '../../../modules/user/user.utils';

@Injectable()
export class FastingChecker extends BaseAchievementChecker {
  /**
   * 实现抽象方法：检查断食成就
   */
  async checkAchievements(userId: string): Promise<string[]> {
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

    // 使用父类的批量更新方法
    return await this.batchUpdateProgress(userId, progressRules);
  }

  /**
   * 实现抽象方法：返回成就类型
   */
  getAchievementType(): AchievementType {
    return AchievementType.fasting;
  }
}
