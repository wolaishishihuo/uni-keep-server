import { FastingType } from '@src/enums/fasting.enum';
import { BadRequestException } from '@nestjs/common';

/**
 * 根据断食类型获取默认计划名称
 * @param fastingType 断食类型
 * @returns 默认的计划名称
 */
export function getDefaultPlanName(fastingType: FastingType): string {
  switch (fastingType) {
    case FastingType.TIME_16_8:
      return '16:8经典断食';
    case FastingType.TIME_18_6:
      return '18:6进阶断食';
    default:
      return '自定义断食计划';
  }
}

/**
 * 计算断食结束时间
 * @param startTime 开始时间（HH:MM格式）
 * @param eatingHours 进食小时数
 * @returns 结束时间（HH:MM格式）
 */
export function calculateEndTime(startTime: string, eatingHours: number): string {
  // 解析开始时间
  const [hours, minutes] = startTime.split(':').map(Number);

  // 创建一个日期对象来进行计算
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  // 添加断食小时数
  date.setTime(date.getTime() + eatingHours * 60 * 60 * 1000);

  // 格式化为HH:MM格式
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * 根据断食类型计算断食时长和进食时长
 * @param fastingType 断食类型
 * @param customFastingHours 自定义断食时长（仅在CUSTOM类型下有效）
 * @returns 包含断食时长和进食时长的对象
 */
export function calculateFastingHours(
  fastingType: FastingType,
  customFastingHours?: number
): { fastingHours: number; eatingHours: number } {
  let fastingHours: number;
  let eatingHours: number;

  switch (fastingType) {
    case FastingType.TIME_16_8:
      fastingHours = 16;
      eatingHours = 8;
      break;
    case FastingType.TIME_18_6:
      fastingHours = 18;
      eatingHours = 6;
      break;
    case FastingType.CUSTOM:
      if (!customFastingHours) {
        throw new BadRequestException('自定义模式必须提供断食时长');
      }
      fastingHours = customFastingHours;
      eatingHours = 24 - fastingHours;
      break;
    default:
      fastingHours = 16;
      eatingHours = 8;
  }

  return { fastingHours, eatingHours };
}
