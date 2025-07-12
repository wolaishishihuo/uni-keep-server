import { ApiProperty } from '@nestjs/swagger';
import { FastingStatus, MoodAfter, MoodBefore } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsEnum } from 'class-validator';

export class BaseFastingRecordDto {
  @ApiProperty({ description: '用户ID' })
  @IsString({ message: '用户ID必须是字符串' })
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId: string;

  @ApiProperty({ description: '计划ID' })
  @IsString({ message: '计划ID必须是字符串' })
  @IsNotEmpty({ message: '计划ID不能为空' })
  planId: string;

  @ApiProperty({ description: '断食状态', enum: FastingStatus })
  @IsEnum(FastingStatus)
  @IsNotEmpty({ message: '断食状态不能为空' })
  status: FastingStatus;

  @ApiProperty({ description: '断食前心情', enum: MoodBefore })
  @IsOptional()
  @IsEnum(MoodBefore, { message: '断食前心情必须是 MoodBefore 枚举值' })
  moodBefore?: MoodBefore;

  @ApiProperty({ description: '断食后心情', enum: MoodAfter })
  @IsOptional()
  @IsEnum(MoodAfter, { message: '断食后心情必须是 MoodAfter 枚举值' })
  moodAfter?: MoodAfter;

  @ApiProperty({ description: '中断原因' })
  @IsOptional()
  @IsString({ message: '中断原因必须是字符串' })
  breakReason?: string;
}
