import { Module } from '@nestjs/common';
import { FastingRecordService } from './fasting-record.service';
import { FastingRecordController } from './fasting-record.controller';
import { AchievementModule } from '@src/modules/achievement/achievement.module';

@Module({
  imports: [AchievementModule],
  controllers: [FastingRecordController],
  providers: [FastingRecordService]
})
export class FastingRecordModule {}
