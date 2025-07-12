import { Inject, Injectable } from '@nestjs/common';
import { CreateFastingRecordDto } from './dto/create-fasting-record.dto';
import { FastingStatus, PrismaClient } from '@prisma/client';
import { UpdateFastingRecordDto } from './dto/update-fasting-record.dto';
import { AchievementService } from '@src/modules/achievement/achievement.service';
import {
  calculateEndTime,
  calculateFastingDurationByTime,
  getContinuousFastingDays,
  getCurrentWeekDays,
  getFastingDays
} from '../utils/fasting.utils';
import { FastingRecordEntity } from './entities/fasting-record.entity';

@Injectable()
export class FastingRecordService {
  constructor(
    @Inject('PrismaClient') private prisma: PrismaClient,
    private achievementService: AchievementService
  ) {}

  async create(createFastingRecordDto: CreateFastingRecordDto) {
    const { fastingDate, eatingHours, ...recordDto } = createFastingRecordDto;
    try {
      const record = await this.prisma.fastingRecord.create({
        data: {
          ...recordDto,
          date: new Date(fastingDate)
        }
      });
      const actualEndTime = calculateEndTime(recordDto.startTime, eatingHours);

      // 创建实体并添加计算的结束时间
      const recordEntity = new FastingRecordEntity(record);
      recordEntity.actualEndTime = actualEndTime;

      return {
        code: 200,
        data: recordEntity,
        message: '创建断食记录成功'
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message
      };
    }
  }
  async getRecord(query: { userId: string; planId: string }) {
    return this.prisma.fastingRecord.findMany({
      where: { userId: query.userId, planId: query.planId },
      // 按创建时间倒序
      orderBy: { createdAt: 'desc' }
    });
  }

  async getRecordByDate(query: { userId: string; date: string }) {
    return this.prisma.fastingRecord.findFirst({
      where: { userId: query.userId, date: new Date(query.date) }
    });
  }

  async getUnfinishedRecord(query: { userId: string; planId: string }) {
    const record = await this.prisma.fastingRecord.findFirst({
      where: { userId: query.userId, planId: query.planId, status: FastingStatus.active }
    });
    return {
      code: 200,
      data: record,
      message: '获取尚未结束的断食记录成功'
    };
  }

  async update(updateFastingRecordDto: UpdateFastingRecordDto) {
    const recordInfo = await this.prisma.fastingRecord.findUnique({
      where: { id: updateFastingRecordDto.id }
    });
    if (!recordInfo) {
      return {
        code: 404,
        message: '断食记录不存在'
      };
    }

    // 使用新的时间计算函数，基于断食记录的日期
    const actualHours = calculateFastingDurationByTime(recordInfo.startTime, updateFastingRecordDto.endTime);

    try {
      await this.prisma.fastingRecord.update({
        where: { id: updateFastingRecordDto.id },
        data: {
          ...updateFastingRecordDto,
          actualHours
        }
      });

      // 🎯 检查断食成就
      // const newAchievements = await this.achievementService.checkFastingAchievements(recordInfo.userId);

      return {
        code: 200,
        message: '更新断食记录成功'
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message
      };
    }
  }

  // 获取断食记录数据统计
  async getRecordDataStatistics(planId: string) {
    const record = await this.prisma.fastingRecord.findMany({
      where: { planId },
      orderBy: { createdAt: 'desc' } // 按创建时间倒序
    });

    // 如果没有记录，返回初始值
    if (!record || record.length === 0) {
      return {
        allDays: 0,
        successDays: 0,
        successRate: 0,
        continuousDays: 0,
        currentWeekDays: 0,
        currentWeekSuccessRate: 0,
        totalFastingDuration: '0'
      };
    }

    //  总天数, 成功天数, 成功率, 连续天数, 本周坚持天数, 本周完成率, 总断食时长
    const allDays = getFastingDays(record) + 1;
    const successDays = record.filter((item) => item.status === FastingStatus.completed).length;

    const successRate = allDays > 0 ? (successDays / allDays) * 100 : 0;
    const continuousDays = getContinuousFastingDays(record);

    const currentWeekDays = getCurrentWeekDays(record) + 1;
    const currentWeekSuccessRate = currentWeekDays > 0 ? (currentWeekDays / currentWeekDays) * 100 : 0;

    // 处理实际时长为null的情况
    const totalFastingDuration = record
      .reduce((acc, item) => acc + (item.actualHours ? Number(item.actualHours.toFixed(2)) : 0), 0)
      .toFixed(2);

    return {
      allDays,
      successDays,
      successRate,
      continuousDays,
      currentWeekDays,
      currentWeekSuccessRate,
      totalFastingDuration
    };
  }

  // 根据Id获取断食记录
  async getRecordById(id: string) {
    const record = await this.prisma.fastingRecord.findUnique({
      where: { id }
    });
    return record;
  }
}
