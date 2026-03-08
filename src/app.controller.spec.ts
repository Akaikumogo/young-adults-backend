import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health object from service', () => {
      const result = controller.getHealth();
      expect(result).toEqual(
        expect.objectContaining({
          status: 'ok',
          message: 'Young Adults Backend API is running',
          timestamp: expect.any(String),
        }),
      );
    });
  });
});
