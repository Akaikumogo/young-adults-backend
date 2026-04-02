import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '../database/entities/employee.entity';
import { Department } from '../database/entities/department.entity';
import { Position } from '../database/entities/position.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UsersService } from '../users/user.service';

const STAFF_ROLES = [
  'teacher',
  'admin',
  'moderator',
  'manager',
  'crm',
  'director',
] as const;
const PUBLIC_STAFF_ROLES = ['teacher', 'manager', 'crm', 'director'] as const;

function toPublicUploadPath(image?: string | null): string | null {
  if (!image || image.trim() === '') return null;
  if (!image.startsWith('http://') && !image.startsWith('https://')) {
    return image;
  }
  try {
    const url = new URL(image);
    if (url.pathname.startsWith('/uploads/')) return url.pathname;
    return image;
  } catch {
    return image;
  }
}

function toEmployeeShape(e: Employee) {
  return {
    ...e,
    department_id: e.department
      ? { _id: e.department._id, name: e.department.name, code: e.department.code }
      : e.department,
    position_id: e.position
      ? { _id: e.position._id, name: e.position.name, code: e.position.code }
      : e.position,
    image: toPublicUploadPath((e as any).image),
  };
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(Department) private departmentRepo: Repository<Department>,
    @InjectRepository(Position) private positionRepo: Repository<Position>,
    private usersService: UsersService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    let department: Department | null = null;
    let position: Position | null = null;

    if (createEmployeeDto.department_id) {
      department = await this.departmentRepo.findOne({
        where: { _id: createEmployeeDto.department_id },
      });
    }
    if (createEmployeeDto.position_id) {
      position = await this.positionRepo.findOne({
        where: { _id: createEmployeeDto.position_id },
      });
    }

    const password = createEmployeeDto.password
      ? await bcrypt.hash(createEmployeeDto.password, 10)
      : null;

    const emp = this.employeeRepo.create({
      name: createEmployeeDto.name,
      role: createEmployeeDto.role,
      description1: createEmployeeDto.description1,
      image: createEmployeeDto.image,
      order: createEmployeeDto.order ?? 0,
      is_active: createEmployeeDto.is_active !== false,
      is_public: createEmployeeDto.is_public !== false,
      department,
      position,
      login: createEmployeeDto.login ?? null,
      password,
    });

    return this.employeeRepo.save(emp);
  }

  async findAll(): Promise<any[]> {
    const employees = await this.employeeRepo.find({
      where: { is_active: true },
      relations: ['department', 'position'],
      order: { order: 'ASC' },
    });
    const publicEmps = employees.filter((e) => e.is_public !== false);

    const users = await this.usersService.findAll();
    const staffUsers = users.filter(
      (user) =>
        PUBLIC_STAFF_ROLES.includes(user.role as any) &&
        user.is_active &&
        user.is_public !== false,
    );

    const employeesWithFullUrls = publicEmps.map((e) => toEmployeeShape(e));

    const userEmployees = staffUsers.map((user, index) => ({
      _id: user._id,
      name: user.full_name,
      role: user.role,
      description1: '',
      image: toPublicUploadPath(user.avatar_url),
      order: 1000 + index,
      is_active: user.is_active,
      is_public: user.is_public !== false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      source: 'user',
      email: user.email,
      phone: user.phone,
    }));

    return [...employeesWithFullUrls, ...userEmployees].sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    );
  }

  async findAllAdmin(): Promise<any[]> {
    const employees = await this.employeeRepo.find({
      relations: ['department', 'position'],
      order: { order: 'ASC' },
    });

    const users = await this.usersService.findAll();
    const staffUsers = users.filter((user) =>
      STAFF_ROLES.includes(user.role as any),
    );

    const employeesWithFullUrls = employees.map((e) => toEmployeeShape(e));

    const userEmployees = staffUsers.map((user, index) => ({
      _id: user._id,
      name: user.full_name,
      role: user.role,
      description1: '',
      image: toPublicUploadPath(user.avatar_url),
      order: 1000 + index,
      is_active: user.is_active,
      is_public: user.is_public !== false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      source: 'user',
      email: user.email,
      phone: user.phone,
    }));

    return [...employeesWithFullUrls, ...userEmployees].sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    );
  }

  async findOne(id: string): Promise<any> {
    const employee = await this.employeeRepo.findOne({
      where: { _id: id },
      relations: ['department', 'position'],
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return toEmployeeShape(employee);
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<any> {
    const updateData: any = { ...updateEmployeeDto };

    if (updateEmployeeDto.password) {
      updateData.password = await bcrypt.hash(updateEmployeeDto.password, 10);
    }

    const employee = await this.employeeRepo.findOne({ where: { _id: id } });
    if (employee) {
      if (updateData.name !== undefined) employee.name = updateData.name;
      if (updateData.role !== undefined) employee.role = updateData.role;
      if (updateData.description1 !== undefined) {
        employee.description1 = updateData.description1;
      }
      if (updateData.image !== undefined) employee.image = updateData.image;
      if (updateData.order !== undefined) employee.order = updateData.order;
      if (updateData.is_active !== undefined) {
        employee.is_active = updateData.is_active;
      }
      if (updateData.is_public !== undefined) {
        employee.is_public = updateData.is_public;
      }
      if (updateData.login !== undefined) employee.login = updateData.login;
      if (updateData.password !== undefined) {
        employee.password = updateData.password;
      }
      if (updateData.department_id !== undefined) {
        employee.department = updateData.department_id
          ? await this.departmentRepo.findOne({
              where: { _id: updateData.department_id },
            })
          : null;
      }
      if (updateData.position_id !== undefined) {
        employee.position = updateData.position_id
          ? await this.positionRepo.findOne({
              where: { _id: updateData.position_id },
            })
          : null;
      }
      return this.employeeRepo.save(employee);
    }

    let user: Awaited<ReturnType<UsersService['findOne']>> | null = null;
    try {
      user = await this.usersService.findOne(id);
    } catch {
      user = null;
    }
    if (user && STAFF_ROLES.includes(user.role as any)) {
      const userPayload: any = {
        full_name: updateData.name ?? user.full_name,
        is_active: updateData.is_active ?? user.is_active,
        is_public: updateData.is_public ?? user.is_public,
        avatar_url: updateData.image ? `${updateData.image}` : user.avatar_url,
      };
      if (updateData.role !== undefined) userPayload.role = updateData.role;
      return this.usersService.update(id, userPayload);
    }

    throw new NotFoundException('Employee not found');
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const employee = await this.employeeRepo.findOne({ where: { _id: id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    employee.password = await bcrypt.hash(newPassword, 10);
    await this.employeeRepo.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.employeeRepo.findOne({ where: { _id: id } });
    if (employee) {
      await this.employeeRepo.delete({ _id: id });
      return;
    }

    try {
      const user = await this.usersService.findOne(id);
      if (user && STAFF_ROLES.includes(user.role as any)) {
        await this.usersService.remove(id);
        return;
      }
      if (user) {
        throw new NotFoundException(
          'Employee not found - user is not a staff member',
        );
      }
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
    }

    throw new NotFoundException('Employee not found');
  }
}
