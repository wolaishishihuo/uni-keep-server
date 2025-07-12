import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, classToPlain, Exclude } from 'class-transformer';
import { dateFormat } from '@src/utils/dateUtil';
import { FastingRecord } from '@prisma/client';

export class FastingRecordEntity {
  @ApiProperty({ description: '断食记录ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: '用户ID' })
  @Expose()
  userId: string;

  @ApiProperty({ description: '断食计划ID' })
  @Expose()
  planId: string;

  @ApiProperty({ description: '实际断食时长' })
  @Expose()
  @Transform(({ value }) => (typeof value === 'object' ? value.toString() : value))
  actualHours: string;

  @ApiProperty({ description: '实际断食结束时间' })
  @Expose()
  actualEndTime: string;

  @ApiProperty({ description: '断食开始时间' })
  @Expose()
  @Transform(({ value }) => (typeof value === 'string' ? value : dateFormat(value, 'HH:mm')))
  startTime: string;

  @ApiProperty({ description: '断食结束时间' })
  @Expose()
  endTime: string;

  @ApiProperty({ description: '断食日期' })
  @Expose()
  @Transform(({ value }) => (typeof value === 'string' ? value : dateFormat(value, 'YYYY-MM-DD')))
  date: string;

  @ApiProperty({ description: '断食记录状态' })
  @Expose()
  status: string;

  // 排除所有未显式标记为@Expose的字段
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  breakReason: string | null;

  @Exclude()
  moodBefore: string | null;

  @Exclude()
  moodAfter: string | null;

  constructor(partial: Partial<FastingRecord>) {
    Object.assign(this, partial);
  }
}
