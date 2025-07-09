import { Test, TestingModule } from '@nestjs/testing';
import { FastingController } from './fasting.controller';
import { FastingService } from './fasting.service';

describe('FastingController', () => {
  let controller: FastingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FastingController],
      providers: [FastingService]
    }).compile();

    controller = module.get<FastingController>(FastingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
