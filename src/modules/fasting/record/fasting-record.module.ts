import { Module } from '@nestjs/common';
import { FastingRecordService } from './fasting-record.service';
import { FastingRecordController } from './fasting-record.controller';

@Module({
  controllers: [FastingRecordController],
  providers: [FastingRecordService]
})
export class FastingRecordModule {}
