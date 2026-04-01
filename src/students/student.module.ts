import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './student.service';
import { StudentsController } from './student.controller';
import { Student } from '../database/entities/student.entity';
import { Group } from '../database/entities/group.entity';
import { Course } from '../database/entities/course.entity';
import { Employee } from '../database/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Group, Course, Employee]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
