import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseFastingDto } from './baseFasting.dto';

export class CreateFastingDto extends BaseFastingDto {
  @ApiProperty({
    description: '用户ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId: string;

  @ApiProperty({
    description: '断食计划名称',
    example: '我的16:8断食计划',
    required: false
  })
  @IsString()
  @IsOptional()
  planName?: string;
}
