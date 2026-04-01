import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Brackets } from 'typeorm';
import { Application } from '../database/entities/application.entity';
import { Course } from '../database/entities/course.entity';
import { Employee } from '../database/entities/employee.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { isValidUuid } from '../utils/is-valid-id';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application) private applicationRepo: Repository<Application>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const course = await this.courseRepo.findOne({
      where: { _id: createApplicationDto.courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (!course.is_active) {
      throw new BadRequestException('This course is not active');
    }

    const qb = this.applicationRepo
      .createQueryBuilder('a')
      .where('a.course_id = :cid', { cid: createApplicationDto.courseId })
      .andWhere('a.status IN (:...st)', { st: ['pending', 'approved'] })
      .andWhere(
        new Brackets((sub) => {
          sub.where('a.phone = :phone', { phone: createApplicationDto.phone });
          if (createApplicationDto.email) {
            sub.orWhere('a.email = :email', {
              email: createApplicationDto.email,
            });
          }
        }),
      );

    const existingApplication = await qb.getOne();

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this course');
    }

    const app = this.applicationRepo.create({
      full_name: createApplicationDto.full_name,
      email: createApplicationDto.email ?? null,
      phone: createApplicationDto.phone,
      course,
      status: 'pending',
      notes: null,
      assignedEmployee: null,
    });

    return this.applicationRepo.save(app);
  }

  async findAll(query?: {
    status?: string;
    courseId?: string;
    page?: number;
    limit?: number;
  }): Promise<
    | Application[]
    | {
        data: Application[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }
  > {
    const where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.courseId) where.course = { _id: query.courseId };

    if (query?.page && query?.limit) {
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;

      const total = await this.applicationRepo.count({ where });
      const data = await this.applicationRepo.find({
        where,
        relations: ['course', 'assignedEmployee'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    return this.applicationRepo.find({
      where,
      relations: ['course', 'assignedEmployee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepo.findOne({
      where: { _id: id },
      relations: ['course', 'assignedEmployee'],
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  async update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    const application = await this.findOne(id);

    if (updateApplicationDto.assignedEmployeeId) {
      if (!isValidUuid(updateApplicationDto.assignedEmployeeId)) {
        throw new BadRequestException('Invalid employee ID');
      }
      application.assignedEmployee = await this.employeeRepo.findOne({
        where: { _id: updateApplicationDto.assignedEmployeeId },
      });
    }

    const { assignedEmployeeId, ...rest } = updateApplicationDto as any;
    Object.assign(application, rest);

    return this.applicationRepo.save(application);
  }

  async remove(id: string): Promise<void> {
    const result = await this.applicationRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('Application not found');
    }
  }

  async removeMany(ids: string[]): Promise<{ deletedCount: number }> {
    const result = await this.applicationRepo.delete({ _id: In(ids) });
    return { deletedCount: result.affected || 0 };
  }

  async removeAll(): Promise<{ deletedCount: number }> {
    const result = await this.applicationRepo.createQueryBuilder().delete().execute();
    return { deletedCount: result.affected || 0 };
  }
}
