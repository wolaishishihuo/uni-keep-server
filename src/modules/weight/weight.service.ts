import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateWeightRecordDto } from './dto/createWeightRecord.dto';
import { dateFormat } from '@src/utils/dateUtil';

@Injectable()
export class WeightService {
  constructor(@Inject('PrismaClient') private prisma: PrismaClient) {}

  async createWeightRecord(createWeightRecordDto: CreateWeightRecordDto) {
    return this.prisma.weightRecord.create({
      data: createWeightRecordDto
    });
  }

  async getWeightRecord(query: { userId: string }) {
    const weightRecord = await this.prisma.weightRecord.findMany({
      where: { userId: query.userId },
      orderBy: { date: 'desc' },
      take: 1
    });
    return {
      code: 200,
      message: '体重记录获取成功',
      data: weightRecord[0] || null
    };
  }

  async getWeightTrendAnalysis(userId: string) {
    const weightRecords = await this.prisma.weightRecord.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      select: {
        weight: true,
        date: true,
        bmi: true
      }
    });

    if (weightRecords.length === 0) {
      return {
        code: 200,
        message: '暂无体重记录',
        data: {
          xAxis: [],
          series: []
        }
      };
    }

    const dates = weightRecords.map((record) => dateFormat(record.date, 'YYYY-MM-DD'));

    const weights = weightRecords.map((record) => parseFloat(record.weight.toString()));

    const bmis = weightRecords.map((record) => (record.bmi ? parseFloat(record.bmi.toString()) : null));

    return {
      code: 200,
      message: '体重趋势分析成功',
      data: {
        xAxis: dates,
        series: [
          {
            name: '体重',
            data: weights,
            type: 'line',
            smooth: true
          },
          {
            name: 'BMI',
            data: bmis,
            type: 'line',
            smooth: true
          }
        ]
      }
    };
  }
}
