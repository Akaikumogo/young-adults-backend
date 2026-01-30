import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UsersService } from '../users/user.service';
import { getImageUrl } from '../utils/image.util';

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
    // Get employees
    const employees = await this.employeeModel
      .find({ is_active: true })
      .populate('department_id', 'name code')
      .populate('position_id', 'name code')
      .sort({ order: 1 })
      .exec();
    
    // Get users with roles: teacher, admin, moderator
    const users = await this.usersService.findAll();
    const staffUsers = users.filter(user => 
      ['teacher', 'admin', 'moderator'].includes(user.role) && user.is_active
    );
    
    // Transform employees - convert image paths to full URLs
    const employeesWithFullUrls = employees.map(employee => ({
      ...employee.toObject(),
      image: getImageUrl(employee.image),
    }));
    
    // Transform users to employee-like format
    const userEmployees = staffUsers.map((user, index) => ({
      _id: user._id,
      name: user.full_name,
      role: user.role,
      birth: '', // User doesn't have birth field
      description1: '', // User doesn't have description field
      image: getImageUrl(user.avatar_url), // Use avatar_url as image and convert to full URL
      slug: `user-${user._id}`, // Generate slug from user ID
      order: 1000 + index, // Put users after employees in order
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      source: 'user', // Mark as coming from users collection
      email: user.email,
      phone: user.phone,
    }));
    
    // Combine employees and users, sort by order
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
    
    // Get all users with roles: teacher, admin, moderator (including inactive)
    const users = await this.usersService.findAll();
    const staffUsers = users.filter(user => 
      ['teacher', 'admin', 'moderator'].includes(user.role)
    );
    
    // Transform employees - convert image paths to full URLs
    const employeesWithFullUrls = employees.map(employee => ({
      ...employee.toObject(),
      image: getImageUrl(employee.image),
    }));
    
    // Transform users to employee-like format
    const userEmployees = staffUsers.map((user, index) => ({
      _id: user._id,
      name: user.full_name,
      role: user.role,
      birth: '', // User doesn't have birth field
      description1: '', // User doesn't have description field
      image: getImageUrl(user.avatar_url), // Use avatar_url as image and convert to full URL
      slug: `user-${user._id}`, // Generate slug from user ID
      order: 1000 + index, // Put users after employees in order
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      source: 'user', // Mark as coming from users collection
      email: user.email,
      phone: user.phone,
    }));
    
    // Combine employees and users, sort by order
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
      image: getImageUrl(employee.image),
    };
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const updateData: any = { ...updateEmployeeDto };
    
    if (updateEmployeeDto.department_id) {
      updateData.department_id = new Types.ObjectId(updateEmployeeDto.department_id);
    }
    
    if (updateEmployeeDto.position_id) {
      updateData.position_id = new Types.ObjectId(updateEmployeeDto.position_id);
    }

    // Hash password if being updated
    if (updateEmployeeDto.password) {
      updateData.password = await bcrypt.hash(updateEmployeeDto.password, 10);
    }

    const employee = await this.employeeModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
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
    const result = await this.employeeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Employee not found');
    }
  }
}

