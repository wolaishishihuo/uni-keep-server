import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { FastingType } from '@src/enums/fasting.enum';

export class BaseFastingDto {
  @ApiProperty({
    description: '断食类型',
    enum: FastingType,
    example: FastingType.TIME_16_8
  })
  @IsEnum(FastingType)
  @IsNotEmpty({ message: '断食类型不能为空' })
  fastingType: FastingType;

  @ApiProperty({
    description: '断食开始时间',
    example: '08:00'
  })
  @IsString()
  @IsNotEmpty({ message: '断食开始时间不能为空' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: '时间格式不正确，应为 HH:mm'
  })
  startTime: string;

  @ApiProperty({
    description: '自定义断食时长(小时)',
    example: 16,
    required: false
  })
  @IsNumber()
  @IsOptional()
  fastingHours?: number;

  @ApiProperty({
    description: '是否为当前活跃计划',
    example: '1'
  })
  @IsString()
  @IsNotEmpty({ message: '是否为当前活跃计划不能为空' })
  isActive: string;

  @ApiProperty({
    description: '断食计划名称',
    example: '16:8经典断食',
    required: false
  })
  @IsString()
  @IsOptional()
  planName?: string;
}
