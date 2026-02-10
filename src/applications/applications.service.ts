import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { Course, CourseDocument } from '../courses/schemas/course.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async create(createApplicationDto: CreateApplicationDto): Promise<ApplicationDocument> {
    // Check if course exists
    const course = await this.courseModel.findById(createApplicationDto.courseId).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if course is active
    if (!course.is_active) {
      throw new BadRequestException('This course is not active');
    }

    // Check if application already exists for this phone/email and course
    const existingApplication = await this.applicationModel
      .findOne({
        $or: [
          { phone: createApplicationDto.phone },
          ...(createApplicationDto.email ? [{ email: createApplicationDto.email }] : [])
        ],
        course: createApplicationDto.courseId,
        status: { $in: ['pending', 'approved'] }
      })
      .exec();

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this course');
    }

    const application = new this.applicationModel({
      full_name: createApplicationDto.full_name,
      email: createApplicationDto.email,
      phone: createApplicationDto.phone,
      course: createApplicationDto.courseId,
      status: 'pending',
    });

    return application.save();
  }

  async findAll(query?: {
    status?: string;
    courseId?: string;
    page?: number;
    limit?: number;
  }): Promise<ApplicationDocument[] | {
    data: ApplicationDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const filter: any = {};

    if (query?.status) {
      filter.status = query.status;
    }

    if (query?.courseId) {
      filter.course = query.courseId;
    }

    if (query?.page && query?.limit) {
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;

      const total = await this.applicationModel.countDocuments(filter).exec();
      const data = await this.applicationModel
        .find(filter)
        .populate('course', 'name_uz name_en name_ru')
        .populate('assignedEmployee', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    }

    return this.applicationModel
      .find(filter)
      .populate('course', 'name_uz name_en name_ru')
      .populate('assignedEmployee', 'name email phone')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<ApplicationDocument> {
    const application = await this.applicationModel
      .findById(id)
      .populate('course', 'name_uz name_en name_ru description_uz description_en description_ru')
      .populate('assignedEmployee', 'name email phone')
      .exec();

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<ApplicationDocument> {
    const updateData: any = { ...updateApplicationDto };

    if (updateApplicationDto.assignedEmployeeId) {
      if (!Types.ObjectId.isValid(updateApplicationDto.assignedEmployeeId)) {
        throw new BadRequestException('Invalid employee ID');
      }
      updateData.assignedEmployee = new Types.ObjectId(updateApplicationDto.assignedEmployeeId);
      delete updateData.assignedEmployeeId;
    }

    const application = await this.applicationModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('course', 'name_uz name_en name_ru')
      .populate('assignedEmployee', 'name email phone')
      .exec();

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async remove(id: string): Promise<void> {
    const result = await this.applicationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Application not found');
    }
  }

  async removeMany(ids: string[]): Promise<{ deletedCount: number }> {
    const result = await this.applicationModel.deleteMany({
      _id: { $in: ids.map(id => new Types.ObjectId(id)) }
    }).exec();
    return { deletedCount: result.deletedCount };
  }

  async removeAll(): Promise<{ deletedCount: number }> {
    const result = await this.applicationModel.deleteMany({}).exec();
    return { deletedCount: result.deletedCount };
  }
}
