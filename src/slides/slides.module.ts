import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlidesService } from './slides.service';
import { SlidesController } from './slides.controller';
import { Slide, SlideSchema } from './schemas/slide.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Slide.name, schema: SlideSchema }]),
  ],
  controllers: [SlidesController],
  providers: [SlidesService],
  exports: [SlidesService],
})
export class SlidesModule {}
