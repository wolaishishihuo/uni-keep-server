import { Inject, Injectable } from '@nestjs/common';
import { CreateFastingDto } from './dto/create-fasting.dto';
import { PrismaClient } from '@prisma/client';
import { calculateEndTime, calculateFastingHours } from '../utils/fasting.utils';

@Injectable()
export class FastingService {
  constructor(@Inject('PrismaClient') private prisma: PrismaClient) {}

  async create(createFastingDto: CreateFastingDto) {
    const { fastingType, planName, startTime, isActive } = createFastingDto;

    // 获取用户选择的断食类型
    const { fastingHours, eatingHours } = calculateFastingHours(fastingType);
    const endTime = calculateEndTime(startTime, eatingHours);

    // 如果设置为活跃计划，则将其他计划设为非活跃
    if (createFastingDto.isActive === '1') {
      await this.deactivateAllPlans(createFastingDto.userId);
    }

    return await this.prisma.fastingPlan.create({
      data: {
        userId: createFastingDto.userId,
        fastingType: createFastingDto.fastingType,
        name: planName,
        fastingHours,
        eatingHours,
        startTime: createFastingDto.startTime,
        endTime,
        isActive: createFastingDto.isActive
      }
    });
  }

  async findAll(userId: string) {
    return this.prisma.fastingPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getActivePlan(userId: string) {
    const plan = await this.prisma.fastingPlan.findFirst({
      where: {
        userId,
        isActive: '1'
      }
    });
    return {
      code: 200,
      data: plan,
      message: '获取活跃断食计划成功'
    };
  }

  private async deactivateAllPlans(userId: string) {
    await this.prisma.fastingPlan.updateMany({
      where: { userId },
      data: { isActive: '0' }
    });
  }
}
