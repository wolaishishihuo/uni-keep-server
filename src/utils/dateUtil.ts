import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const defaultFormat = 'YYYY-MM-DD HH:mm:ss.SSS Z';

/**
 * 格式化时间戳为指定格式字符串（默认北京时间）。
 * @param timestamp 时间戳或可解析时间字符串
 * @param format 可选，格式化模板
 * @param utcOffset 可选，时区偏移（小时），默认8
 * @returns 格式化后的时间字符串
 * @example
 * // 格式化当前时间为北京时间字符串
 * dateFormat(Date.now());
 * // => '2024-07-09 15:20:00.000 +08:00'
 *
 * // 格式化为自定义格式（UTC时间）
 * dateFormat(1720500000000, 'YYYY/MM/DD HH:mm', 0);
 * // => '2024/07/09 07:20'
 */
export const dateFormat = (timestamp: number | string | Date, format?: string, utcOffset?: number) => {
  return dayjs(timestamp)
    .utcOffset(utcOffset || 8)
    .format(format || defaultFormat);
};

/**
 * 解析时间字符串为 dayjs 对象（默认北京时间）。
 * @param date 时间字符串
 * @param format 可选，格式化模板
 * @param utcOffset 可选，时区偏移（小时），默认8
 * @returns dayjs对象
 * @example
 * // 解析北京时间字符串
 * const d = dateParse('2024-07-09 15:20:00.000 +08:00');
 * d.format(); // => '2024-07-09T15:20:00+08:00'
 */
export const dateParse = (date: string, format?: string, utcOffset?: number) => {
  const dateFormatString = format || defaultFormat;
  let result = dayjs(date, { format: dateFormatString, utc: true });
  if (dateFormatString && !dateFormatString.includes('Z')) {
    result = result.subtract(utcOffset || 8, 'hours');
  }
  return result;
};

/**
 * 解析 HH:mm:ss 字符串为 Date 对象（默认今天，默认北京时间）。
 * @param timeString 时间字符串，格式为 HH:mm:ss
 * @param baseDate 可选，基础日期
 * @param utcOffset 可选，时区偏移（小时），默认8
 * @returns Date对象
 * @example
 * // 解析今天的 12:30:00
 * parseTimeString('12:30:00');
 * // => new Date('2024-07-09T12:30:00+08:00')
 *
 * // 指定基础日期
 * parseTimeString('08:00:00', '2024-07-01');
 * // => new Date('2024-07-01T08:00:00+08:00')
 */
export const parseTimeString = (timeString: string, baseDate?: Date | string, utcOffset?: number): Date => {
  // 验证时间格式
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  if (!timeRegex.test(timeString)) {
    throw new Error('时间格式不正确，应为 HH:mm:ss');
  }

  // 使用基础日期，默认为今天
  const base = baseDate ? dayjs(baseDate) : dayjs();

  // 解析时间字符串
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  // 创建完整的日期时间对象
  const result = base
    .hour(hours)
    .minute(minutes)
    .second(seconds)
    .millisecond(0)
    .utcOffset(utcOffset || 8);

  return result.toDate();
};

/**
 * 格式化 Date 为 HH:mm:ss 字符串（默认北京时间）。
 * @param date 日期对象
 * @param utcOffset 可选，时区偏移（小时），默认8
 * @returns 时间字符串
 * @example
 * // 格式化当前时间
 * formatTimeString(new Date()); // '15:20:00'
 */
export const formatTimeString = (date: Date, utcOffset?: number): string => {
  return dayjs(date)
    .utcOffset(utcOffset || 8)
    .format('HH:mm:ss');
};

/**
 * 校验时间字符串格式（HH:mm:ss）。
 * @param timeString 时间字符串
 * @returns 是否有效
 * @example
 * isValidTimeString('12:30:00'); // true
 * isValidTimeString('25:00:00'); // false
 */
export const isValidTimeString = (timeString: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  return timeRegex.test(timeString);
};

export type IDateUtil = 'ms' | 's' | 'm' | 'h' | 'd';

/**
 * 获取时间单位对应的毫秒数。
 * @param dateUtil 单位（ms/s/m/h/d）
 * @returns 毫秒数
 * @example
 * msofUtil('h'); // 3600000
 * msofUtil('d'); // 86400000
 */
export const msofUtil = (dateUtil: IDateUtil): number => {
  const msMap = {
    ms: 1,
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000
  };
  return msMap[dateUtil];
};

/**
 * 计算两个时间相差的天数（默认北京时间）。
 * @param start 起始时间
 * @param end 结束时间，默认当前时间
 * @param utcOffset 可选，时区偏移（小时），默认8
 * @returns 天数差
 * @example
 * // 计算 2024-07-01 到 2024-07-09 相差天数
 * getDaysDiff('2024-07-01', '2024-07-09'); // => 8
 *
 * // 只传起始时间，计算到今天
 * getDaysDiff('2024-07-01');
 */
export const getDaysDiff = (
  start: string | number | Date,
  end?: string | number | Date,
  utcOffset: number = 8
): number => {
  const startDay = dayjs(start || dayjs())
    .utcOffset(utcOffset)
    .startOf('day');
  const endDay = end ? dayjs(end).utcOffset(utcOffset).startOf('day') : dayjs().utcOffset(utcOffset).startOf('day');
  return endDay.diff(startDay, 'day');
};

/**
 * 暴露 dayjs 原生能力。
 */
export default dayjs;
