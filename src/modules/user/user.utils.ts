import { FastingPlan, FastingRecord } from '@prisma/client';
import dayjs, { getDaysDiff } from '@src/utils/dateUtil';

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

export const getFastingDays = (fastingPlans: FastingPlan[]) => {
  if (!fastingPlans.length) {
    return 0;
  }
  return getDaysDiff(fastingPlans[0].createdAt);
};
