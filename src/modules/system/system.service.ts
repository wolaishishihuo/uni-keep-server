import { Inject, Injectable } from '@nestjs/common';
import { UpdateSystemDto } from './dto/update-system.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SystemService {
  constructor(@Inject('PrismaClient') private readonly prisma: PrismaClient) {}

  findAll() {
    return this.prisma.systemConfig.findMany();
  }

  update(updateSystemDto: UpdateSystemDto) {
    try {
      this.prisma.systemConfig.update({
        where: { key: updateSystemDto.key },
        data: { value: updateSystemDto.value }
      });

      return {
        code: 200,
        message: '更新系统配置成功'
      };
    } catch (error) {
      console.error('更新系统配置失败:', error);
      return {
        code: 500,
        message: '更新系统配置失败'
      };
    }
  }
}
