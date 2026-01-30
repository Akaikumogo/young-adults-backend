import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<DepartmentDocument> {
    const hashedPassword = await bcrypt.hash(createDepartmentDto.password, 10);
    const department = new this.departmentModel({
      ...createDepartmentDto,
      password: hashedPassword,
    });
    return department.save();
  }

  async findAll(): Promise<DepartmentDocument[]> {
    return this.departmentModel.find({ is_active: true }).sort({ name: 1 }).exec();
  }

  async findAllAdmin(): Promise<DepartmentDocument[]> {
    return this.departmentModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<DepartmentDocument> {
    const department = await this.departmentModel.findById(id).exec();
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  async findByLogin(login: string): Promise<DepartmentDocument | null> {
    return this.departmentModel.findOne({ login }).exec();
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<DepartmentDocument> {
    const updateData: any = { ...updateDepartmentDto };
    
    // If password is being updated, hash it
    if (updateDepartmentDto.password) {
      updateData.password = await bcrypt.hash(updateDepartmentDto.password, 10);
    }

    const department = await this.departmentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async remove(id: string): Promise<void> {
    const result = await this.departmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Department not found');
    }
  }

  async validateDepartment(login: string, password: string): Promise<DepartmentDocument> {
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

