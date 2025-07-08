import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RequiredUserInfoDto } from './requiredUserInfo.dto';
import { BaseFastingDto } from '../../fasting/fasting-plan/dto/baseFasting.dto';
import { UpdateSystemDto } from '@src/modules/system/dto/update-system.dto';

export class CompleteSetupDto {
  @ApiProperty({
    description: '用户ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId: string;

  @ApiProperty({
    description: '系统配置键',
    example: 'default_weight_reminder_time'
  })
  @ValidateNested()
  @Type(() => UpdateSystemDto)
  @IsNotEmpty({ message: '系统配置不能为空' })
  systemConfig: UpdateSystemDto[];

  @ApiProperty({
    description: '断食计划',
    type: BaseFastingDto
  })
  @ValidateNested()
  @Type(() => BaseFastingDto)
  @IsNotEmpty({ message: '断食计划不能为空' })
  fastingPlan: BaseFastingDto;

  @ApiProperty({
    description: '基础信息',
    type: RequiredUserInfoDto
  })
  @ValidateNested()
  @Type(() => RequiredUserInfoDto)
  @IsNotEmpty({ message: '基础信息不能为空' })
  userInfo: RequiredUserInfoDto;
}
