import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './course.service';
import { CoursesController } from './course.controller';
import { Course } from '../database/entities/course.entity';
import { Employee } from '../database/entities/employee.entity';
import { Student } from '../database/entities/student.entity';
import { GroupsModule } from '../groups/group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Employee, Student]),
    forwardRef(() => GroupsModule),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
