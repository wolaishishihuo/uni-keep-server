import { FastingType } from '@src/enums/fasting.enum';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { FastingRecord } from '@prisma/client';
import dayjs, { getDateDiff } from '@src/utils/dateUtil';

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

// 获取连续断食天数
export const getContinuousFastingDays = (fastingRecords: FastingRecord[]) => {
  if (!fastingRecords.length) {
    return 0;
  }
  // 1. 取出所有断食日期（去重，格式YYYY-MM-DD）
  const fastingRecordsDateSet = new Set(fastingRecords.map((record) => dayjs(record.createdAt).format('YYYY-MM-DD')));
  // 2. 转为数组并降序排序
  const sortedDates = Array.from(fastingRecordsDateSet).sort((a: string, b: string) => {
    return dayjs(b).diff(dayjs(a));
  });
  // 3. 从最新日期开始，依次判断是否连续
  let current = dayjs(sortedDates[0] as string);
  let continuousFastingDays = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const next = dayjs(sortedDates[i] as string);
    if (current.diff(next, 'day') === 1) {
      continuousFastingDays++;
      current = next;
    } else {
      break; // 遇到断档，停止计数
    }
  }
  return continuousFastingDays;
};

// 获取断食天数
export const getFastingDays = (fastingRecords: FastingRecord[]) => {
  if (!fastingRecords.length) {
    return 0;
  }
  const { days } = getDateDiff(fastingRecords[0].createdAt);
  return days;
};

// 获取当前周的断食天数
export const getCurrentWeekDays = (fastingRecords: FastingRecord[]) => {
  if (!fastingRecords.length) {
    return 0;
  }

  // 获取当前周的开始和结束时间
  const currentWeekStart = dayjs().startOf('week');
  const currentWeekEnd = dayjs().endOf('week');

  // 筛选出当前周的记录（按创建日期去重）
  const fastingDates = new Set();

  fastingRecords.forEach((record) => {
    const recordDate = dayjs(record.createdAt);
    // 判断记录是否在当前周内
    if (recordDate.isAfter(currentWeekStart) && recordDate.isBefore(currentWeekEnd)) {
      // 添加日期（只计算天数，不重复计算同一天）
      fastingDates.add(recordDate.format('YYYY-MM-DD'));
    }
  });

  return fastingDates.size;
};

/**
 * 计算断食时长（基于完整日期时间格式）
 * @param startDateTime 开始时间，格式为 YYYY-MM-DD HH:mm:ss
 * @param endDateTime 结束时间，格式为 YYYY-MM-DD HH:mm:ss
 * @param utcOffset 可选，时区偏移（小时），默认8
 * @returns 断食时长（小时，保留2位小数）
 */
export const calculateFastingDurationByTime = (
  startDateTime: string,
  endDateTime: string,
  utcOffset: number = 8
): number => {
  // 验证日期时间格式
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!dateTimeRegex.test(startDateTime) || !dateTimeRegex.test(endDateTime)) {
    throw new HttpException('时间格式不正确，应为 YYYY-MM-DD HH:mm:ss', HttpStatus.BAD_REQUEST);
  }

  // 解析开始时间和结束时间
  const startTime = dayjs(startDateTime, 'YYYY-MM-DD HH:mm:ss').utcOffset(utcOffset);
  const endTime = dayjs(endDateTime, 'YYYY-MM-DD HH:mm:ss').utcOffset(utcOffset);

  // 验证日期有效性
  if (!startTime.isValid() || !endTime.isValid()) {
    throw new BadRequestException('无效的日期时间格式');
  }

  // 确保结束时间不早于开始时间
  if (endTime.isBefore(startTime)) {
    throw new HttpException('结束时间不能早于开始时间', HttpStatus.BAD_REQUEST);
  }

  // 计算时长差异（小时）
  const diffHours = endTime.diff(startTime, 'hour', true);

  // 保留2位小数
  return Math.round(diffHours * 100) / 100;
};
