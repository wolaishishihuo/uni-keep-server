import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CompleteSetupDto } from './dto/completeSetup.dto';
import { calculateEndTime, calculateFastingHours, getDefaultPlanName } from '../fasting/utils/fasting.utils';

@Injectable()
export class UserService {
  constructor(@Inject('PrismaClient') private prisma: PrismaClient) {}

  async create(data: any): Promise<any> {
    return this.prisma.user.create({ data });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.user.findMany();
  }

  async findBy(params): Promise<any[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.user.findFirst({
      where: { id },
      include: {
        fastingPlans: {
          where: {
            isActive: '1'
          }
        },
        fastingRecords: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
  }

  async remove(where): Promise<any> {
    return this.prisma.user.delete({
      where
    });
  }

  async update(updateUserDto: UpdateUserDto): Promise<any> {
    try {
      return await this.prisma.user.update({
        data: updateUserDto,
        where: { id: updateUserDto.id }
      });
    } catch (error) {
      console.error('更新用户失败:', error);
      throw new BadRequestException('更新用户失败');
    }
  }

  // 初始化用户完成设置
  async completeSetup(completeSetupDto: CompleteSetupDto) {
    const { userId, systemConfig, fastingPlan, userInfo } = completeSetupDto;
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException(`用户不存在`);
    }
    const age = new Date().getFullYear() - new Date(userInfo.birthday).getFullYear();

    // 获取用户选择的断食类型
    const fastingType = fastingPlan.fastingType;
    const { fastingHours, eatingHours } = calculateFastingHours(fastingType);
    const endTime = calculateEndTime(fastingPlan.startTime, eatingHours);
    const planName = fastingPlan.planName || getDefaultPlanName(fastingType);

    return await this.prisma.$transaction(async (tx) => {
      // 使用事务参数 tx 更新用户信息
      await tx.user.update({
        data: { ...userInfo, age },
        where: { id: userId }
      });

      // 创建断食计划
      await tx.fastingPlan.create({
        data: {
          name: planName,
          fastingType,
          fastingHours,
          eatingHours,
          startTime: fastingPlan.startTime,
          endTime,
          isActive: '1', // 默认开启
          userId
        }
      });

      // 批量更新系统配置
      await Promise.all(
        systemConfig.map((config) =>
          tx.systemConfig.upsert({
            where: { key: config.key },
            update: { value: config.value },
            create: {
              key: config.key,
              value: config.value
            }
          })
        )
      );

      return {
        data: null,
        code: 1,
        message: '完成用户设置成功'
      };
    });
  }
}
