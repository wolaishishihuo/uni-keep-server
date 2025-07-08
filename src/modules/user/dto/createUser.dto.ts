import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  IsUrl,
  IsBoolean,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  Min,
  Max
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '@src/enums/user';

export class CreateUserDto {
  @ApiProperty({
    description: '微信OpenID',
    example: 'oktKs5fwLGa1JSdMOhX8tFWwRdww',
    maxLength: 100
  })
  @IsNotEmpty({ message: 'OpenID不能为空' })
  @IsString()
  @MaxLength(100, { message: 'OpenID最多100个字符' })
  openId: string;

  @ApiProperty({
    description: '微信UnionID',
    example: 'o6_bmasdasdsad6_2sgVt7hMZOPfL',
    required: false,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'UnionID最多100个字符' })
  unionId?: string;

  @ApiProperty({
    description: '用户昵称',
    example: '小明',
    maxLength: 50
  })
  @IsNotEmpty({ message: '昵称不能为空' })
  @IsString()
  @MinLength(1, { message: '昵称不能为空' })
  @MaxLength(50, { message: '昵称最多50个字符' })
  nickname: string;

  @ApiProperty({
    description: '用户头像URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: '请输入有效的头像URL' })
  @MaxLength(255, { message: '头像URL最多255个字符' })
  avatar?: string;

  @ApiProperty({
    description: '身高(cm)',
    example: 170.5,
    required: false,
    minimum: 50,
    maximum: 300
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: '身高最多保留2位小数' })
  @Min(50, { message: '身高不能小于50cm' })
  @Max(300, { message: '身高不能大于300cm' })
  @Transform(({ value }) => parseFloat(value))
  height?: number;

  @ApiProperty({
    description: '目标体重(kg)',
    example: 65.5,
    required: false,
    minimum: 20,
    maximum: 300
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: '目标体重最多保留2位小数' })
  @Min(20, { message: '目标体重不能小于20kg' })
  @Max(300, { message: '目标体重不能大于300kg' })
  @Transform(({ value }) => parseFloat(value))
  targetWeight?: number;

  @ApiProperty({
    description: '当前体重(kg)',
    example: 70.0,
    required: false,
    minimum: 20,
    maximum: 300
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: '当前体重最多保留2位小数' })
  @Min(20, { message: '当前体重不能小于20kg' })
  @Max(300, { message: '当前体重不能大于300kg' })
  @Transform(({ value }) => parseFloat(value))
  currentWeight?: number;

  @ApiProperty({
    description: '性别',
    example: 'male',
    enum: Gender,
    required: false
  })
  @IsOptional()
  @IsEnum(Gender, { message: '性别只能是 male 或 female' })
  gender?: Gender;

  @ApiProperty({
    description: '年龄',
    example: 25,
    required: false,
    minimum: 1,
    maximum: 150
  })
  @IsOptional()
  @IsInt({ message: '年龄必须是整数' })
  @Min(1, { message: '年龄不能小于1岁' })
  @Max(150, { message: '年龄不能大于150岁' })
  age?: number;

  @ApiProperty({
    description: '邀请码',
    example: 'INVITE123',
    required: false,
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: '邀请码至少6位' })
  @MaxLength(20, { message: '邀请码最多20位' })
  @Matches(/^[A-Z0-9]+$/, { message: '邀请码只能包含大写字母和数字' })
  inviteCode?: string;

  @ApiProperty({
    description: '情侣ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false
  })
  @IsOptional()
  @IsString()
  coupleId?: string;

  @ApiProperty({
    description: '是否激活',
    example: true,
    required: false,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean = true;
}
