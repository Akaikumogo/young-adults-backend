import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, In } from 'typeorm';
import { Student } from '../database/entities/student.entity';
import { Group } from '../database/entities/group.entity';
import { Course } from '../database/entities/course.entity';
import { Employee } from '../database/entities/employee.entity';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { GradeStudentDto } from './dto/grade-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
  ) {}

  async create(enrollStudentDto: EnrollStudentDto): Promise<Student> {
    const course = await this.courseRepo.findOne({
      where: { _id: enrollStudentDto.courseId },
      relations: ['employees'],
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    let group: Group | null = null;
    if (enrollStudentDto.groupId?.trim()) {
      group = await this.groupRepo.findOne({
        where: { _id: enrollStudentDto.groupId },
      });
      if (group) {
        const cnt = await this.studentRepo.count({
          where: { group: { _id: group._id } },
        });
        if (group.maxStudents && cnt >= group.maxStudents) {
          throw new BadRequestException(
            `Group is full. Maximum ${group.maxStudents} students allowed.`,
          );
        }
      }
    }

    let employee: Employee | null = null;
    if (enrollStudentDto.employeeId?.trim()) {
      employee = await this.employeeRepo.findOne({
        where: { _id: enrollStudentDto.employeeId },
      });
    }

    const student = this.studentRepo.create({
      full_name: enrollStudentDto.full_name,
      email: enrollStudentDto.email ?? null,
      phone: enrollStudentDto.phone,
      course,
      group,
      employee,
      enrollment_date: new Date(),
      status: 'active',
      grades: null,
      attendance: null,
    });

    return this.studentRepo.save(student);
  }

  async enrollUserInCourse(user: any, courseId: string): Promise<Student> {
    const course = await this.courseRepo.findOne({
      where: { _id: courseId },
      relations: ['employees'],
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (!course.is_active) {
      throw new BadRequestException('This course is not active');
    }

    const existing = await this.studentRepo.findOne({
      where: {
        email: user.email,
        course: { _id: courseId },
        status: 'active',
      },
    });
    if (existing) {
      throw new BadRequestException('You are already enrolled in this course');
    }

    let employee: Employee | null = null;
    if (course.employees?.length) {
      employee = course.employees[0];
    }

    const student = this.studentRepo.create({
      full_name: user.full_name || 'Unknown',
      phone: user.phone || '',
      email: user.email ?? null,
      course,
      group: null,
      employee,
      enrollment_date: new Date(),
      status: 'active',
    });

    return this.studentRepo.save(student);
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepo.find({
      relations: ['course', 'employee', 'group'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepo.findOne({
      where: { _id: id },
      relations: ['course', 'employee', 'group'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async findByEmployee(employeeId: string): Promise<Student[]> {
    return this.studentRepo.find({
      where: { employee: { _id: employeeId } },
      relations: ['course', 'employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCourse(courseId: string): Promise<Student[]> {
    return this.studentRepo.find({
      where: { course: { _id: courseId } },
      relations: ['course', 'employee', 'group'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEmployeeCourses(employeeId: string): Promise<Student[]> {
    const courses = await this.courseRepo
      .createQueryBuilder('c')
      .innerJoin('c.employees', 'e')
      .where('e._id = :eid', { eid: employeeId })
      .select('c._id')
      .getMany();

    const courseIds = courses.map((c) => c._id);
    if (!courseIds.length) return [];

    return this.studentRepo.find({
      where: { course: { _id: In(courseIds) } },
      relations: ['course', 'employee', 'group'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCourseWithPagination(
    courseId: string,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      employeeId?: string;
      groupId?: string;
      status?: string;
    },
  ): Promise<{
    data: Student[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.studentRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.course', 'course')
      .leftJoinAndSelect('s.employee', 'employee')
      .leftJoinAndSelect('s.group', 'group')
      .where('s.course_id = :courseId', { courseId });

    if (query.employeeId) {
      qb.andWhere('s.employee_id = :employeeId', {
        employeeId: query.employeeId,
      });
    }
    if (query.groupId) {
      qb.andWhere('s.group_id = :groupId', { groupId: query.groupId });
    }
    if (query.status) {
      qb.andWhere('s.status = :status', { status: query.status });
    }
    if (query.search) {
      const q = `%${query.search}%`;
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('s.full_name ILIKE :q', { q })
            .orWhere('s.email ILIKE :q', { q })
            .orWhere('s.phone ILIKE :q', { q });
        }),
      );
    }

    const total = await qb.clone().getCount();
    const data = await qb
      .orderBy('s.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateData: Partial<Student>): Promise<Student> {
    await this.studentRepo.update({ _id: id }, updateData as any);
    return this.findOne(id);
  }

  async gradeStudent(id: string, gradeStudentDto: GradeStudentDto): Promise<Student> {
    const student = await this.findOne(id);

    if (gradeStudentDto.grades) {
      student.grades = {
        ...(student.grades || {}),
        ...gradeStudentDto.grades,
      };
    }

    if (
      gradeStudentDto.attendanceDate &&
      gradeStudentDto.present !== undefined
    ) {
      if (!student.attendance) {
        student.attendance = [];
      }
      student.attendance.push({
        date: new Date(gradeStudentDto.attendanceDate).toISOString(),
        present: gradeStudentDto.present,
      });
    }

    return this.studentRepo.save(student);
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentRepo.delete({ _id: id });
    if (!result.affected) {
      throw new NotFoundException('Student not found');
    }
  }
}
