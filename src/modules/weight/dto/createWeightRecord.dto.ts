import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWeightRecordDto {
  @ApiProperty({
    description: '用户ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId: string;

  @ApiProperty({
    description: '体重',
    example: 70.0
  })
  @IsNumber()
  @IsNotEmpty({ message: '体重不能为空' })
  weight: number;

  @ApiProperty({
    description: '日期',
    example: '2021-01-01'
  })
  @IsDate()
  @IsNotEmpty({ message: '日期不能为空' })
  date: Date;
}
