import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Gender } from '@src/enums/user';
import { dateFormat } from '@src/utils/dateUtil';

export class UserResponseEntity {
  @ApiProperty({
    description: '用户ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: '用户昵称',
    example: '小明'
  })
  @Expose()
  nickname: string;

  @ApiProperty({
    description: '用户头像URL',
    example: 'https://example.com/avatar.jpg',
    required: false
  })
  @Expose()
  avatar?: string;

  @ApiProperty({
    description: '身高(cm)',
    example: 170.5,
    required: false
  })
  @Expose()
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  height?: number;

  @ApiProperty({
    description: '目标体重(kg)',
    example: 65.5,
    required: false
  })
  @Expose()
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  targetWeight?: number;

  @ApiProperty({
    description: '当前体重(kg)',
    example: 70.0,
    required: false
  })
  @Expose()
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  currentWeight?: number;

  @ApiProperty({
    description: '性别',
    example: 'male',
    enum: Gender,
    required: false
  })
  @Expose()
  gender?: Gender;

  @ApiProperty({
    description: '年龄',
    example: 25,
    required: false
  })
  @Expose()
  age?: number;

  @ApiProperty({
    description: '邀请码',
    example: 'INVITE123',
    required: false
  })
  @Expose()
  inviteCode?: string;

  @ApiProperty({
    description: '情侣ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false
  })
  @Expose()
  coupleId?: string;

  @ApiProperty({
    description: '是否激活',
    example: true
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: '最后登录时间',
    example: '2025-06-30T02:12:55.000Z',
    required: false
  })
  @Expose()
  @Transform(({ value }) => (value ? dateFormat(value, 'YYYY-MM-DD HH:mm:ss') : null))
  lastLoginAt?: string;

  @ApiProperty({
    description: '创建时间',
    example: '2025-06-30T02:12:55.000Z'
  })
  @Expose()
  @Transform(({ value }) => (value ? dateFormat(value, 'YYYY-MM-DD HH:mm:ss') : null))
  createdAt: string;

  @ApiProperty({
    description: '更新时间',
    example: '2025-06-30T02:12:55.000Z'
  })
  @Expose()
  @Transform(({ value }) => (value ? dateFormat(value, 'YYYY-MM-DD HH:mm:ss') : null))
  updatedAt: string;

  // 敏感信息不暴露给前端
  @Exclude()
  openId: string;

  @Exclude()
  unionId?: string;

  @ApiProperty({
    description: '个性签名',
    example: '个性签名',
    required: false
  })
  @Expose()
  signature?: string;

  @ApiProperty({
    description: '断食天数',
    example: 10,
    required: false
  })
  @Expose()
  fastingDays?: number;

  @ApiProperty({
    description: '连续断食天数',
    example: 10,
    required: false
  })
  @Expose()
  continuousFastingDays?: number;

  @ApiProperty({
    description: '是否完成基本设置',
    example: true
  })
  @Expose()
  get isSetup(): boolean {
    return !!(this.nickname && this.currentWeight && this.targetWeight);
  }

  @ApiProperty({
    description: 'BMI',
    example: 22.5,
    required: false
  })
  @Expose()
  get bmi(): string {
    return (this.currentWeight / (this.height / 100) ** 2).toFixed(2);
  }

  @ApiProperty({
    description: '目标达成率',
    example: 100,
    required: false
  })
  @Expose()
  get targetRate(): string {
    return ((this.targetWeight / this.currentWeight) * 100).toFixed(2);
  }

  constructor(partial: Partial<UserResponseEntity>) {
    Object.assign(this, partial);
  }
}
