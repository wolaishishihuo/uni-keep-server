import { Test, TestingModule } from '@nestjs/testing';
import { SpiderController } from './spider.controller';
import { SpiderService } from './spider.service';

describe('SpiderController', () => {
  let controller: SpiderController;
  let service: SpiderService;

  const mockSpiderService = {
    startTask: jest.fn(),
    stopTask: jest.fn(),
    getTaskStatus: jest.fn()
    // 添加其他需要的方法mock
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpiderController],
      providers: [
        {
          provide: SpiderService,
          useValue: mockSpiderService
        }
      ]
    }).compile();

    controller = module.get<SpiderController>(SpiderController);
    service = module.get<SpiderService>(SpiderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });
});
