import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { Group, GroupDocument } from '../groups/schemas/group.schema';
import { Course, CourseDocument } from '../courses/schemas/course.schema';
import { Employee, EmployeeDocument } from '../employees/schemas/employee.schema';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { GradeStudentDto } from './dto/grade-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  async create(enrollStudentDto: EnrollStudentDto): Promise<StudentDocument> {
    const studentData: any = {
      full_name: enrollStudentDto.full_name,
      email: enrollStudentDto.email,
      phone: enrollStudentDto.phone,
      course: enrollStudentDto.courseId,
      enrollment_date: new Date(),
      status: 'active',
    };

    // Only set employee if employeeId is provided
    if (enrollStudentDto.employeeId && enrollStudentDto.employeeId.trim() !== '') {
      studentData.employee = enrollStudentDto.employeeId;
    }

    // Only set group if groupId is provided (admin/moderator can set this)
    // Students self-enrolling should not have groupId set
    if (enrollStudentDto.groupId && enrollStudentDto.groupId.trim() !== '') {
      studentData.group = enrollStudentDto.groupId;
    }

    const student = new this.studentModel(studentData);
    const savedStudent = await student.save();

    // If groupId is provided, also add student to group's students array
    if (enrollStudentDto.groupId && enrollStudentDto.groupId.trim() !== '') {
      try {
        const group = await this.groupModel.findById(enrollStudentDto.groupId).exec();
        if (group) {
          // Check max students limit
          const currentStudentIds = group.students.map((s: any) => 
            typeof s === 'object' && s._id ? s._id.toString() : s.toString()
          );
          
          if (group.maxStudents && currentStudentIds.length >= group.maxStudents) {
            throw new BadRequestException(
              `Group is full. Maximum ${group.maxStudents} students allowed.`
            );
          }

          // Add student to group's students array if not already present
          const studentIdStr = savedStudent._id.toString();
          if (!currentStudentIds.includes(studentIdStr)) {
            group.students.push(savedStudent._id as any);
            await group.save();
          }
        }
      } catch (error) {
        // If group update fails, log but don't fail student creation
        // The student's group field is already set, admin can fix group's students array manually if needed
        if (error instanceof BadRequestException) {
          throw error; // Re-throw BadRequestException (group full)
        }
        // For other errors, continue - student is created with group field set
      }
    }

    return savedStudent;
  }

  async enrollUserInCourse(user: any, courseId: string): Promise<StudentDocument> {
    // Check if course exists
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if course is active
    if (!course.is_active) {
      throw new BadRequestException('This course is not active');
    }

    // Check if user is already enrolled in this course (check by user ID or email)
    const existingEnrollment = await this.studentModel
      .findOne({
        $or: [
          { email: user.email },
          // If we have user ID stored somewhere, check that too
        ],
        course: courseId,
        status: { $in: ['active'] }
      })
      .exec();

    if (existingEnrollment) {
      throw new BadRequestException('You are already enrolled in this course');
    }

    // Create student enrollment with user info from token
    const studentData: any = {
      full_name: user.full_name || 'Unknown',
      phone: user.phone || '',
      course: courseId,
      enrollment_date: new Date(),
      status: 'active',
    };

    // Add email if available
    if (user.email) {
      studentData.email = user.email;
    }

    // Try to assign an employee from the course if available
    if (course.employees && course.employees.length > 0) {
      // Get the first employee from the course
      const employeeId = course.employees[0];
      studentData.employee = employeeId;
    }

    const student = new this.studentModel(studentData);
    return student.save();
  }

  async findAll(): Promise<StudentDocument[]> {
    return this.studentModel.find().populate('course').populate('employee').exec();
  }

  async findOne(id: string): Promise<StudentDocument> {
    const student = await this.studentModel
      .findById(id)
      .populate('course')
      .populate('employee')
      .exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async findByEmployee(employeeId: string): Promise<StudentDocument[]> {
    return this.studentModel
      .find({ employee: employeeId })
      .populate('course')
      .populate('employee')
      .exec();
  }

  async findByCourse(courseId: string): Promise<StudentDocument[]> {
    return this.studentModel
      .find({ course: courseId })
      .populate('course')
      .populate('employee')
      .populate('group')
      .exec();
  }

  async findByEmployeeCourses(employeeId: string): Promise<StudentDocument[]> {
    // Find all courses where this employee is assigned
    const courses = await this.courseModel
      .find({ employees: employeeId })
      .select('_id')
      .lean()
      .exec();
    
    const courseIds = courses.map((c: any) => c._id);
    
    if (courseIds.length === 0) {
      return [];
    }
    
    // Find all students whose course is in the employee's courses
    return this.studentModel
      .find({ course: { $in: courseIds } })
      .populate('course')
      .populate('employee')
      .populate('group')
      .exec();
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
    }
  ): Promise<{
    data: StudentDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { course: courseId };

    if (query.employeeId) {
      filter.employee = query.employeeId;
    }

    if (query.groupId) {
      filter.group = query.groupId;
    }

    if (query.status) {
      filter.status = query.status;
    }

    // Build search filter
    if (query.search) {
      filter.$or = [
        { full_name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await this.studentModel.countDocuments(filter).exec();

    // Get paginated data
    const data = await this.studentModel
      .find(filter)
      .populate('course', 'name description duration')
      .populate('employee', 'name email phone')
      .populate('group', 'name')
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

  async update(id: string, updateData: Partial<Student>): Promise<StudentDocument> {
    const student = await this.studentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('course')
      .populate('employee')
      .exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async gradeStudent(id: string, gradeStudentDto: GradeStudentDto): Promise<StudentDocument> {
    const student = await this.findOne(id);
    const studentDoc = student as StudentDocument;

    if (gradeStudentDto.grades) {
      studentDoc.grades = { ...(studentDoc.grades || {}), ...gradeStudentDto.grades };
    }

    if (gradeStudentDto.attendanceDate && gradeStudentDto.present !== undefined) {
      if (!studentDoc.attendance) {
        studentDoc.attendance = [];
      }
      studentDoc.attendance.push({
        date: new Date(gradeStudentDto.attendanceDate),
        present: gradeStudentDto.present,
      });
    }

    return studentDoc.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Student not found');
    }
  }
}

