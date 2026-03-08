import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return status ok and message', () => {
      const result = service.getHealth();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('message', 'Young Adults Backend API is running');
      expect(result).toHaveProperty('timestamp');
      expect(typeof (result as any).timestamp).toBe('string');
    });

    it('should return valid ISO timestamp', () => {
      const result = service.getHealth();
      const timestamp = (result as any).timestamp;
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });
  });
});
