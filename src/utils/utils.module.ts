import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClearImagesService } from './clear-images.service';
import { ClearImagesController } from './clear-images.controller';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { Employee, EmployeeSchema } from '../employees/schemas/employee.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Course, CourseSchema } from '../courses/schemas/course.schema';
import { About, AboutSchema } from '../about/schemas/about.schema';
import { Location, LocationSchema } from '../locations/schemas/location.schema';
import { Service, ServiceSchema } from '../services/schemas/service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: About.name, schema: AboutSchema },
      { name: Location.name, schema: LocationSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
  controllers: [ClearImagesController],
  providers: [ClearImagesService],
  exports: [ClearImagesService],
})
export class UtilsModule {}
