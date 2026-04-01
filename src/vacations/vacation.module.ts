import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationsService } from './vacation.service';
import { VacationsController } from './vacation.controller';
import { Vacation } from '../database/entities/vacation.entity';
import { Employee } from '../database/entities/employee.entity';
import { Department } from '../database/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacation, Employee, Department]),
  ],
  controllers: [VacationsController],
  providers: [VacationsService],
  exports: [VacationsService],
})
export class VacationsModule {}
