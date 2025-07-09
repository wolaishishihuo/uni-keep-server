import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseFastingRecordDto } from './base-fasting-record.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFastingRecordDto extends PartialType(BaseFastingRecordDto) {
  @ApiProperty({ description: '断食记录ID' })
  @IsString({ message: '断食记录ID必须是字符串' })
  @IsNotEmpty({ message: '断食记录ID不能为空' })
  id: string;

  @ApiProperty({ description: '断食实际结束时间' })
  @IsString({ message: '断食实际结束时间必须是字符串' })
  @IsNotEmpty({ message: '断食实际结束时间不能为空' })
  endTime: string;
}
