import { Inject, Injectable } from '@nestjs/common';
import { CreateFastingRecordDto } from './dto/create-fasting-record.dto';
import { FastingStatus, PrismaClient } from '@prisma/client';
import { UpdateFastingRecordDto } from './dto/update-fasting-record.dto';
import { calculateFastingDurationByTime } from '@utils/dateUtil';
import { AchievementService } from '@src/modules/achievement/achievement.service';

@Injectable()
export class FastingRecordService {
  constructor(
    @Inject('PrismaClient') private prisma: PrismaClient,
    private achievementService: AchievementService
  ) {}

  async create(createFastingRecordDto: CreateFastingRecordDto) {
    const { fastingDate, ...recordDto } = createFastingRecordDto;
    try {
      await this.prisma.fastingRecord.create({
        data: {
          ...recordDto,
          date: new Date(fastingDate)
        }
      });
      return {
        code: 200,
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
      const newAchievements = await this.achievementService.checkFastingAchievements(recordInfo.userId);

      // 🎉 如果有新成就解锁，可以发送通知
      if (newAchievements.length > 0) {
        console.log(`用户 ${recordInfo.userId} 解锁了新成就:`, newAchievements);
        // TODO: 发送成就通知
      }

      return {
        code: 200,
        message: '更新断食记录成功',
        data: {
          unlockedAchievements: newAchievements // 返回给前端显示
        }
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message
      };
    }
  }
}
