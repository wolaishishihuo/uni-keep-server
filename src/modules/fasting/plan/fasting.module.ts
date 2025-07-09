import { Module } from '@nestjs/common';
import { FastingService } from './fasting.service';
import { FastingController } from './fasting.controller';

@Module({
  controllers: [FastingController],
  providers: [FastingService]
})
export class FastingModule {}
