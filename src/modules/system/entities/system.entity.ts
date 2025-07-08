import { ApiProperty } from '@nestjs/swagger';

export class System {
  @ApiProperty({
    description: '系统配置键',
    example: 'system.config.key'
  })
  key: string;

  @ApiProperty({
    description: '系统配置值',
    example: '系统配置值'
  })
  value: string;

  @ApiProperty({
    description: '系统配置描述',
    example: '系统配置描述'
  })
  description: string;

  @ApiProperty({
    description: '系统配置是否公开',
    example: true
  })
  isPublic: boolean;
}
