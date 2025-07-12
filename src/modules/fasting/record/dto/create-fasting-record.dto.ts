import { ApiProperty } from '@nestjs/swagger';
import { BaseFastingRecordDto } from './base-fasting-record.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateFastingRecordDto extends BaseFastingRecordDto {
  @ApiProperty({ description: '断食实际开始时间' })
  @IsNotEmpty({ message: '断食实际开始时间不能为空' })
  startTime: string;

  @ApiProperty({ description: '断食日期' })
  @IsNotEmpty({ message: '断食日期不能为空' })
  fastingDate: string;

  @ApiProperty({ description: '进食时长' })
  @IsNotEmpty({ message: '进食时长不能为空' })
  eatingHours: number;
}
