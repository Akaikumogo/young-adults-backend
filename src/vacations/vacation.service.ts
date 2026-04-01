import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacation } from '../database/entities/vacation.entity';
import { Employee } from '../database/entities/employee.entity';
import { Department } from '../database/entities/department.entity';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { GetVacationsDto } from './dto/get-vacations.dto';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(Vacation) private vacationRepo: Repository<Vacation>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(Department) private departmentRepo: Repository<Department>,
  ) {}

  async create(createVacationDto: CreateVacationDto): Promise<Vacation> {
    const employee = await this.employeeRepo.findOneOrFail({
      where: { _id: createVacationDto.employee_id },
    });
    const department = await this.departmentRepo.findOneOrFail({
      where: { _id: createVacationDto.department_id },
    });

    const vacation = this.vacationRepo.create({
      employee,
      department,
      year: createVacationDto.year,
      month: createVacationDto.month,
      has_vacation: createVacationDto.has_vacation,
    });
    return this.vacationRepo.save(vacation);
  }

  async findAll(query: GetVacationsDto): Promise<Vacation[]> {
    const qb = this.vacationRepo
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.employee', 'employee')
      .leftJoinAndSelect('v.department', 'department')
      .orderBy('v.year', 'DESC')
      .addOrderBy('v.month', 'ASC');

    if (query.year !== undefined) {
      qb.andWhere('v.year = :year', { year: query.year });
    }
    if (query.department_id) {
      qb.andWhere('v.department_id = :did', { did: query.department_id });
    }
    if (query.employee_id) {
      qb.andWhere('v.employee_id = :eid', { eid: query.employee_id });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Vacation> {
    const vacation = await this.vacationRepo.findOne({
      where: { _id: id },
      relations: ['employee', 'department'],
    });
    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }
    return vacation;
  }

  async findByEmployeeAndYear(
    employeeId: string,
    year: number,
  ): Promise<Vacation[]> {
    return this.vacationRepo.find({
      where: { employee: { _id: employeeId }, year },
      order: { month: 'ASC' },
    });
  }

  async findByDepartmentAndYear(
    departmentId: string,
    year: number,
  ): Promise<Vacation[]> {
    return this.vacationRepo.find({
      where: { department: { _id: departmentId }, year },
      relations: ['employee'],
      order: { month: 'ASC' },
    });
  }

  async getVacationStatsByYearAndDepartment(year: number): Promise<any[]> {
    const rows = await this.vacationRepo
      .createQueryBuilder('v')
      .innerJoin('v.department', 'd')
      .select('v.department_id', 'department_id')
      .addSelect('d.name', 'department_name')
      .addSelect('v.month', 'month')
      .addSelect('COUNT(*)', 'count')
      .where('v.year = :year', { year })
      .andWhere('v.has_vacation = true')
      .groupBy('v.department_id')
      .addGroupBy('d.name')
      .addGroupBy('v.month')
      .getRawMany();

    return rows.map((r) => ({
      department_id: r.department_id,
      department_name: r.department_name,
      month: parseInt(r.month, 10),
      count: parseInt(r.count, 10),
    }));
  }

  async upsertVacation(
    createVacationDto: CreateVacationDto,
  ): Promise<Vacation> {
    const employee = await this.employeeRepo.findOneOrFail({
      where: { _id: createVacationDto.employee_id },
    });
    const department = await this.departmentRepo.findOneOrFail({
      where: { _id: createVacationDto.department_id },
    });

    let row = await this.vacationRepo.findOne({
      where: {
        employee: { _id: employee._id },
        year: createVacationDto.year,
        month: createVacationDto.month,
      },
    });

    if (!row) {
      row = this.vacationRepo.create({
        employee,
        department,
        year: createVacationDto.year,
        month: createVacationDto.month,
        has_vacation: createVacationDto.has_vacation,
      });
    } else {
      row.department = department;
      row.has_vacation = createVacationDto.has_vacation;
    }

    return this.vacationRepo.save(row);
  }

  async update(
    id: string,
    updateVacationDto: UpdateVacationDto,
  ): Promise<Vacation> {
    const vacation = await this.findOne(id);

    if (updateVacationDto.employee_id) {
      vacation.employee = await this.employeeRepo.findOneOrFail({
        where: { _id: updateVacationDto.employee_id },
      });
    }
    if (updateVacationDto.department_id) {
      vacation.department = await this.departmentRepo.findOneOrFail({
        where: { _id: updateVacationDto.department_id },
      });
    }
    if (updateVacationDto.year !== undefined) {
      vacation.year = updateVacationDto.year;
    }
    if (updateVacationDto.month !== undefined) {
      vacation.month = updateVacationDto.month;
    }
    if (updateVacationDto.has_vacation !== undefined) {
      vacation.has_vacation = updateVacationDto.has_vacation;
    }

    return this.vacationRepo.save(vacation);
  }

  async remove(id: string): Promise<void> {
    const result = await this.vacationRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('Vacation not found');
    }
  }
}
