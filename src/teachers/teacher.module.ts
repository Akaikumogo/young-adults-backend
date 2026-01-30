import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeachersService } from './teacher.service';
import { TeachersController } from './teacher.controller';
import { Teacher, TeacherSchema } from './schemas/teacher.schema';
import { CoursesModule } from '../courses/course.module';
import { StudentsModule } from '../students/student.module';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
    CoursesModule,
    StudentsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}

