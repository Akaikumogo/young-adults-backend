import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from '../database/entities/application.entity';
import { Course } from '../database/entities/course.entity';
import { Employee } from '../database/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Course, Employee]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
