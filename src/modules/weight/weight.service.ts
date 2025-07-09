import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateWeightRecordDto } from './dto/createWeightRecord.dto';

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
}
