import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesService } from './course.service';
import { CoursesController } from './course.controller';
import { Course, CourseSchema } from './schemas/course.schema';
import { Employee, EmployeeSchema } from '../employees/schemas/employee.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Student, StudentSchema } from '../students/schemas/student.schema';
import { GroupsModule } from '../groups/group.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
    forwardRef(() => GroupsModule),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}

