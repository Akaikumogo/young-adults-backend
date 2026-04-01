import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Course } from '../database/entities/course.entity';
import { Employee } from '../database/entities/employee.entity';
import { Student } from '../database/entities/student.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { GroupsService } from '../groups/group.service';
import { isValidUuid } from '../utils/is-valid-id';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @Inject(forwardRef(() => GroupsService))
    private groupsService: GroupsService,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const { employeeIds, ...rest } = createCourseDto;
    const course = this.courseRepo.create(rest);
    const saved = await this.courseRepo.save(course);

    if (employeeIds?.length) {
      for (const id of employeeIds) {
        if (!isValidUuid(id)) {
          throw new BadRequestException(`Invalid employee ID: ${id}`);
        }
      }
      const emps = await this.employeeRepo.findBy({ _id: In(employeeIds) });
      saved.employees = emps;
    } else {
      saved.employees = [];
    }
    await this.courseRepo.save(saved);

    return this.courseRepo.findOneOrFail({
      where: { _id: saved._id },
      relations: ['employees'],
    });
  }

  async findAll(): Promise<any[]> {
    const courses = await this.courseRepo.find({
      relations: ['employees'],
      order: { createdAt: 'DESC' },
    });

    const raw = await this.studentRepo
      .createQueryBuilder('s')
      .select('s.course_id', 'courseId')
      .addSelect('COUNT(*)', 'cnt')
      .where('s.status != :d', { d: 'dropped' })
      .groupBy('s.course_id')
      .getRawMany();

    const countByCourse: Record<string, number> = {};
    for (const row of raw) {
      if (row.courseId) {
        countByCourse[row.courseId] = parseInt(row.cnt, 10);
      }
    }

    return courses.map((course) => ({
      ...course,
      studentsCount: countByCourse[course._id] || 0,
    }));
  }

  async findOne(id: string): Promise<any> {
    if (!isValidUuid(id)) {
      throw new BadRequestException('Invalid course ID format');
    }

    const course = await this.courseRepo.findOne({
      where: { _id: id },
      relations: ['employees', 'employees.department', 'employees.position'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.employees?.length) {
      const transformedEmployees = course.employees
        .filter((e) => e && e._id)
        .map((employee) => ({
          _id: employee._id,
          full_name: employee.name || '',
          email: '',
          phone: '',
          image: employee.image || null,
          position: employee.position?.name ?? null,
          department: employee.department?.name ?? null,
          is_active: employee.is_active !== undefined ? employee.is_active : true,
        }));

      return {
        ...course,
        employees: transformedEmployees,
      };
    }

    return { ...course, employees: [] };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { _id: id },
      relations: ['employees'],
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const { employeeIds, ...rest } = updateCourseDto as UpdateCourseDto & {
      employeeIds?: string[];
    };

    Object.assign(course, rest);

    if (employeeIds !== undefined) {
      if (employeeIds.length) {
        for (const eid of employeeIds) {
          if (!isValidUuid(eid)) {
            throw new BadRequestException(`Invalid employee ID: ${eid}`);
          }
        }
        course.employees = await this.employeeRepo.findBy({
          _id: In(employeeIds),
        });
      } else {
        course.employees = [];
      }
    }

    return this.courseRepo.save(course);
  }

  async remove(id: string): Promise<void> {
    const result = await this.courseRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('Course not found');
    }
  }

  async assignEmployees(
    id: string,
    assignEmployeeDto: AssignEmployeeDto,
  ): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { _id: id },
      relations: ['employees'],
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    for (const eid of assignEmployeeDto.employeeIds) {
      if (!isValidUuid(eid)) {
        throw new BadRequestException(`Invalid employee ID: ${eid}`);
      }
    }

    course.employees = await this.employeeRepo.findBy({
      _id: In(assignEmployeeDto.employeeIds),
    });
    return this.courseRepo.save(course);
  }

  async findByEmployee(employeeId: string): Promise<Course[]> {
    return this.courseRepo
      .createQueryBuilder('c')
      .innerJoin('c.employees', 'e')
      .where('e._id = :eid', { eid: employeeId })
      .leftJoinAndSelect('c.employees', 'employees')
      .orderBy('c.createdAt', 'DESC')
      .getMany();
  }

  async findOneWithDetails(id: string): Promise<any> {
    const course = await this.findOne(id);
    const groups = await this.groupsService.findAll(id);
    const unassignedStudents = await this.groupsService.getUnassignedStudents(id);

    const studentsCount = await this.studentRepo.count({
      where: { course: { _id: id }, status: Not('dropped') },
    });

    return {
      ...course,
      groups,
      unassignedStudents,
      studentsCount,
    };
  }

  async getCourseEmployees(courseId: string): Promise<EmployeeResponseDto[]> {
    if (!isValidUuid(courseId)) {
      throw new BadRequestException('Invalid course ID format');
    }

    const course = await this.courseRepo.findOne({
      where: { _id: courseId },
      relations: ['employees', 'employees.department', 'employees.position'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!course.employees?.length) {
      return [];
    }

    return course.employees.map((employee) => ({
      _id: employee._id,
      full_name: employee.name || '',
      email: '',
      phone: '',
      image: employee.image || null,
      position: employee.position?.name ?? null,
      department: employee.department?.name ?? null,
      is_active: employee.is_active !== undefined ? employee.is_active : true,
    }));
  }
}
