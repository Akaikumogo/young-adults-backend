import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClearImagesService } from './clear-images.service';
import { ClearImagesController } from './clear-images.controller';
import { SiteEvent } from '../database/entities/event.entity';
import { Employee } from '../database/entities/employee.entity';
import { User } from '../database/entities/user.entity';
import { Course } from '../database/entities/course.entity';
import { About } from '../database/entities/about.entity';
import { Location } from '../database/entities/location.entity';
import { Service } from '../database/entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SiteEvent,
      Employee,
      User,
      Course,
      About,
      Location,
      Service,
    ]),
  ],
  controllers: [ClearImagesController],
  providers: [ClearImagesService],
  exports: [ClearImagesService],
})
export class UtilsModule {}
