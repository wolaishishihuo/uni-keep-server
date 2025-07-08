import { Test, TestingModule } from '@nestjs/testing';
import { FastingRecordService } from './fasting-record.service';

describe('FastingRecordService', () => {
  let service: FastingRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FastingRecordService]
    }).compile();

    service = module.get<FastingRecordService>(FastingRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
