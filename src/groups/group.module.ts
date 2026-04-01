import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './group.service';
import { GroupsController } from './group.controller';
import { Group } from '../database/entities/group.entity';
import { GroupHistory } from '../database/entities/group-history.entity';
import { Student } from '../database/entities/student.entity';
import { Course } from '../database/entities/course.entity';
import { Employee } from '../database/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      GroupHistory,
      Student,
      Course,
      Employee,
    ]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
