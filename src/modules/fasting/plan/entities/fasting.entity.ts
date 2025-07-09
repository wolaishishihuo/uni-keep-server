import { ApiProperty } from '@nestjs/swagger';
import { FastingType } from '@src/enums/fasting.enum';

export class FastingPlanEntity {
  @ApiProperty({ description: '计划唯一标识符' })
  id: string;

  @ApiProperty({ description: '用户ID' })
  userId: string;

  @ApiProperty({ description: '计划名称' })
  name: string;

  @ApiProperty({ description: '断食类型' })
  fastingType: FastingType;

  @ApiProperty({ description: '断食时长(小时)' })
  fastingHours: number;

  @ApiProperty({ description: '进食时长(小时)' })
  eatingHours: number;

  @ApiProperty({ description: '开始时间(HH:MM格式)' })
  startTime: string;

  @ApiProperty({ description: '结束时间(HH:MM格式)' })
  endTime: string;

  @ApiProperty({ description: '是否活跃' })
  isActive: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
