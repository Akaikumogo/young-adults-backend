import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UsersService } from '../users/user.service';

const STAFF_ROLES = ['teacher', 'admin', 'moderator', 'manager', 'crm', 'director'] as const;

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    private usersService: UsersService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employeeData: any = { ...createEmployeeDto };
    
    if (createEmployeeDto.department_id) {
      employeeData.department_id = new Types.ObjectId(createEmployeeDto.department_id);
    }
    
    if (createEmployeeDto.position_id) {
      employeeData.position_id = new Types.ObjectId(createEmployeeDto.position_id);
    }

    // Hash password if provided
    if (createEmployeeDto.password) {
      employeeData.password = await bcrypt.hash(createEmployeeDto.password, 10);
    }
    
    const employee = new this.employeeModel(employeeData);
    return employee.save();
  }

  async findAll(): Promise<any[]> {
    // Get employees (active + public only for landing)
    const employees = await this.employeeModel
      .find({ is_active: true, is_public: { $ne: false } })
      .populate('department_id', 'name code')
      .populate('position_id', 'name code')
      .sort({ order: 1 })
      .exec();

    // Get staff users — active + public only for landing
    const users = await this.usersService.findAll();
    const staffUsers = users.filter(
      (user) =>
        STAFF_ROLES.includes(user.role as any) &&
        user.is_active &&
        user.is_public !== false
    );

    // Transform employees - convert image paths to full URLs
    const employeesWithFullUrls = employees.map((employee) => ({
      ...employee.toObject(),
      image: employee.image,
    }));

    // Transform users to employee-like format
    const userEmployees = staffUsers.map((user, index) => ({
      _id: user._id,
      name: user.full_name,
      role: user.role,
      description1: '',
      image: user.avatar_url,
      order: 1000 + index,
      is_active: user.is_active,
      is_public: user.is_public !== false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      source: 'user',
      email: user.email,
      phone: user.phone,
    }));

    const allStaff = [...employeesWithFullUrls, ...userEmployees].sort((a, b) =>
      (a.order || 0) - (b.order || 0)
    );

    return allStaff;
  }

  async findAllAdmin(): Promise<any[]> {
    // Get all employees (including inactive)
    const employees = await this.employeeModel
      .find()
      .populate('department_id', 'name code')
      .populate('position_id', 'name code')
      .sort({ order: 1 })
      .exec();
    
    // Get all users with staff roles (including inactive; admin list shows all)
    const users = await this.usersService.findAll();
    const staffUsers = users.filter((user) => STAFF_ROLES.includes(user.role as any));
    
    // Transform employees - convert image paths to full URLs
    const employeesWithFullUrls = employees.map(employee => ({
      ...employee.toObject(),
      image: employee.image,
    }));
    
    // Transform users to employee-like format
    const userEmployees = staffUsers.map((user, index) => ({
      _id: user._id,
      name: user.full_name,
      role: user.role,
      description1: '',
      image: user.avatar_url,
      order: 1000 + index,
      is_active: user.is_active,
      is_public: user.is_public !== false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      source: 'user',
      email: user.email,
      phone: user.phone,
    }));

    const allStaff = [...employeesWithFullUrls, ...userEmployees].sort((a, b) =>
      (a.order || 0) - (b.order || 0)
    );

    return allStaff;
  }

  async findOne(id: string): Promise<any> {
    const employee = await this.employeeModel
      .findById(id)
      .populate('department_id', 'name code')
      .populate('position_id', 'name code')
      .exec();
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    // Convert image path to full URL
    return {
      ...employee.toObject(),
      image: employee.image,
    };
  }

async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<any> {
  const updateData: any = { ...updateEmployeeDto };

  if (updateEmployeeDto.password) {
    updateData.password = await bcrypt.hash(updateEmployeeDto.password, 10);
  }

  // 1️⃣ Employee collection
  const employee = await this.employeeModel
    .findByIdAndUpdate(id, updateData, { new: true })
    .exec();

  if (employee) return employee;

  // 2️⃣ User collection
  const user = await this.usersService.findOne(id);

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
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.employeeModel.findByIdAndUpdate(id, { password: hashedPassword }).exec();
  }

  async remove(id: string): Promise<void> {
    // First try to find in Employee collection
    const employee = await this.employeeModel.findById(id).exec();
    if (employee) {
      await this.employeeModel.findByIdAndDelete(id).exec();
      return;
    }
    
    // If not found in Employee collection, try User collection
    // Check if it's a user with role teacher, admin, or moderator
    try {
      const user = await this.usersService.findOne(id);
      if (user && STAFF_ROLES.includes(user.role as any)) {
        await this.usersService.remove(id);
        return;
      } else if (user) {
        // User found but not a staff user (not teacher/admin/moderator)
        throw new NotFoundException('Employee not found - user is not a staff member');
      }
    } catch (error) {
      // If it's already a NotFoundException, re-throw it
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Otherwise, user not found or other error - continue to throw NotFoundException below
    }
    
    // If neither found, throw NotFoundException
    throw new NotFoundException('Employee not found');
  }
}

