import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlidesService } from './slides.service';
import { SlidesController } from './slides.controller';
import { Slide } from '../database/entities/slide.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slide])],
  controllers: [SlidesController],
  providers: [SlidesService],
  exports: [SlidesService],
})
export class SlidesModule {}
