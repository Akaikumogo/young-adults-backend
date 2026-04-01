import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const seedService = app.get(SeedService);
    const result = await seedService.seedPublicContent();
    console.log('✅ Seed finished', result);
  } finally {
    await app.close();
  }
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

