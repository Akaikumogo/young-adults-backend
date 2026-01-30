import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsService } from './student.service';
import { StudentsController } from './student.controller';
import { Student, StudentSchema } from './schemas/student.schema';
import { Group, GroupSchema } from '../groups/schemas/group.schema';
import { Course, CourseSchema } from '../courses/schemas/course.schema';
import { Teacher, TeacherSchema } from '../teachers/schemas/teacher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Teacher.name, schema: TeacherSchema },
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}

