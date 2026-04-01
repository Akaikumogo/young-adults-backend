import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Department } from '../database/entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department) private departmentRepo: Repository<Department>,
  ) {}

  async create(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    const hashedPassword = await bcrypt.hash(createDepartmentDto.password, 10);
    const department = this.departmentRepo.create({
      ...createDepartmentDto,
      password: hashedPassword,
    });
    return this.departmentRepo.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepo.find({
      where: { is_active: true },
      order: { name: 'ASC' },
    });
  }

  async findAllAdmin(): Promise<Department[]> {
    return this.departmentRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepo.findOne({ where: { _id: id } });
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  async findByLogin(login: string): Promise<Department | null> {
    return this.departmentRepo.findOne({ where: { login } });
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);
    const patch: any = { ...updateDepartmentDto };
    if (updateDepartmentDto.password) {
      patch.password = await bcrypt.hash(updateDepartmentDto.password, 10);
    }
    Object.assign(department, patch);
    return this.departmentRepo.save(department);
  }

  async remove(id: string): Promise<void> {
    const result = await this.departmentRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('Department not found');
    }
  }

  async validateDepartment(
    login: string,
    password: string,
  ): Promise<Department> {
    const department = await this.findByLogin(login);
    if (!department) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, department.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!department.is_active) {
      throw new UnauthorizedException('Department account is inactive');
    }

    return department;
  }
}
