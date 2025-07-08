import { ApiProperty } from '@nestjs/swagger';
import { BaseFastingRecordDto } from './base-fasting-record.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateFastingRecordDto extends BaseFastingRecordDto {
  @ApiProperty({ description: '断食记录ID' })
  @IsString({ message: '断食记录ID必须是字符串' })
  @IsNotEmpty({ message: '断食记录ID不能为空' })
  id: string;

  @ApiProperty({ description: '断食实际结束时间' })
  @IsString({ message: '断食实际结束时间必须是字符串' })
  @IsNotEmpty({ message: '断食实际结束时间不能为空' })
  endTime: string;

  @ApiProperty({ description: '实际断食时长' })
  @IsNumber({}, { message: '实际断食时长必须是数字' })
  @IsNotEmpty({ message: '实际断食时长不能为空' })
  actualHours: number;
}
