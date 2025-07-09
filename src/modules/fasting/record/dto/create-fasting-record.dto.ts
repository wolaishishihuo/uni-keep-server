import { ApiProperty } from '@nestjs/swagger';
import { BaseFastingRecordDto } from './base-fasting-record.dto';

export class CreateFastingRecordDto extends BaseFastingRecordDto {
  @ApiProperty({ description: '断食实际开始时间' })
  startTime: string;

  @ApiProperty({ description: '断食日期' })
  fastingDate: string;
}
