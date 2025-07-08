import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, MinLength, MaxLength, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '@src/enums/user';

export class BaseUserInfoDto {
  @ApiProperty({
    description: '用户昵称',
    example: '小明',
    required: false,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '昵称不能为空' })
  @MaxLength(50, { message: '昵称最多50个字符' })
  nickname?: string;

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
    description: '生日',
    example: '1990-01-01',
    required: false,
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  @MaxLength(10, { message: '生日最多10个字符' })
  birthday?: string;
}
