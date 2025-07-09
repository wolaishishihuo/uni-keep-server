import { Inject, Injectable } from '@nestjs/common';
import { CreateFastingRecordDto } from './dto/create-fasting-record.dto';
import { PrismaClient } from '@prisma/client';
import { UpdateFastingRecordDto } from './dto/update-fasting-record.dto';
import { calculateFastingDurationByTime } from '@utils/dateUtil';

@Injectable()
export class FastingRecordService {
  constructor(@Inject('PrismaClient') private prisma: PrismaClient) {}

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
    const actualHours = calculateFastingDurationByTime(
      recordInfo.startTime,
      updateFastingRecordDto.endTime,
      recordInfo.date
    );

    try {
      await this.prisma.fastingRecord.update({
        where: { id: updateFastingRecordDto.id },
        data: {
          ...updateFastingRecordDto,
          actualHours
        }
      });
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
}
