import { Module } from '@nestjs/common';
import { FastingService } from './fasting.service';
import { FastingController } from './fasting.controller';
import { FastingRecordModule } from '../record/fasting-record.module';

@Module({
  imports: [FastingRecordModule],
  controllers: [FastingController],
  providers: [FastingService],
  exports: [FastingService]
})
export class FastingModule {}
