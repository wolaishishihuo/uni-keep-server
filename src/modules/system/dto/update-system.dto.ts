import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSystemDto {
  @ApiProperty({
    description: '系统配置键',
    example: 'system.config.key'
  })
  @IsString()
  @IsNotEmpty({ message: '系统配置键不能为空' })
  key: string;

  @ApiProperty({
    description: '系统配置值，支持字符串、数字、布尔值',
    example: '系统配置值'
  })
  @IsString()
  @IsNotEmpty({ message: '系统配置值不能为空' })
  value: string;
}
