import { Test, TestingModule } from '@nestjs/testing';
import { FastingRecordController } from './fasting-record.controller';
import { FastingRecordService } from './fasting-record.service';

describe('FastingRecordController', () => {
  let controller: FastingRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FastingRecordController],
      providers: [FastingRecordService]
    }).compile();

    controller = module.get<FastingRecordController>(FastingRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
