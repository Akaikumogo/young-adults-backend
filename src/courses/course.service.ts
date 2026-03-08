import { Injectable, NotFoundException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { Employee, EmployeeDocument } from '../employees/schemas/employee.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Student, StudentDocument } from '../students/schemas/student.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { GroupsService } from '../groups/group.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @Inject(forwardRef(() => GroupsService))
    private groupsService: GroupsService,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    // Convert employeeIds to employees ObjectId array
    const courseData: any = { ...createCourseDto };
    
    if (createCourseDto.employeeIds && createCourseDto.employeeIds.length > 0) {
      // Validate and convert employeeIds to ObjectId array
      try {
        courseData.employees = createCourseDto.employeeIds.map(id => {
          if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid employee ID: ${id}`);
          }
          return new Types.ObjectId(id);
        });
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new BadRequestException('Invalid employee IDs format');
      }
      delete courseData.employeeIds;
    } else {
      courseData.employees = [];
    }

    const course = new this.courseModel(courseData);
    return course.save();
  }

  async findAll(): Promise<any[]> {
    const courses = await this.courseModel.find().populate('employees').sort({ createdAt: -1 }).lean().exec();
    
    // Get students count for each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course: any) => {
        const studentsCount = await this.studentModel.countDocuments({ 
          course: course._id,
          status: { $ne: 'dropped' } // Only count active and completed students
        }).exec();
        return {
          ...course,
          studentsCount,
        };
      })
    );
    
    return coursesWithCounts;
  }

  async findOne(id: string): Promise<any> {
    // Validate courseId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid course ID format');
    }

    const course = await this.courseModel
      .findById(id)
        .populate({
        path: 'employees',
        select: 'name email phone image position_id department_id is_active',
        populate: [
          { path: 'position_id', select: 'name' },
          { path: 'department_id', select: 'name' }
        ]
      })
      .lean()
      .exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Transform employees array to include full data
    if (course.employees && Array.isArray(course.employees) && course.employees.length > 0) {
      const transformedEmployees = course.employees
        .filter((employee: any) => {
          return employee && typeof employee === 'object' && employee._id;
        })
        .map((employee: any) => {
          return {
            _id: employee._id.toString(),
            full_name: employee.name || '',
            email: employee.email || '',
            phone: employee.phone || '',
            image: employee.image || null,
            position: employee.position_id ? (employee.position_id as any)?.name || null : null,
            department: employee.department_id ? (employee.department_id as any)?.name || null : null,
            is_active: employee.is_active !== undefined ? employee.is_active : true,
          };
        })
        .filter((employee: any) => employee !== null);

      return {
        ...course,
        employees: transformedEmployees,
      };
    }

    return {
      ...course,
      employees: [],
    };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    // Convert employeeIds to employees ObjectId array if provided
    const updateData: any = { ...updateCourseDto };
    
    if (updateCourseDto.employeeIds !== undefined) {
      if (updateCourseDto.employeeIds.length > 0) {
        // Validate and convert employeeIds to ObjectId array
        try {
          updateData.employees = updateCourseDto.employeeIds.map(id => {
            if (!Types.ObjectId.isValid(id)) {
              throw new BadRequestException(`Invalid employee ID: ${id}`);
            }
            return new Types.ObjectId(id);
          });
        } catch (error) {
          if (error instanceof BadRequestException) {
            throw error;
          }
          throw new BadRequestException('Invalid employee IDs format');
        }
      } else {
        updateData.employees = [];
      }
      delete updateData.employeeIds;
    }

    const course = await this.courseModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('employees')
      .exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async remove(id: string): Promise<void> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Course not found');
    }
  }

  async assignEmployees(id: string, assignEmployeeDto: AssignEmployeeDto): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Validate and convert employeeIds to ObjectId array
    try {
      course.employees = assignEmployeeDto.employeeIds.map(id => {
        if (!Types.ObjectId.isValid(id)) {
          throw new BadRequestException(`Invalid employee ID: ${id}`);
        }
        return new Types.ObjectId(id);
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid employee IDs format');
    }

    return course.save();
  }

  async findByEmployee(employeeId: string): Promise<Course[]> {
    // Find courses where the employee's _id is in the employees array
    return this.courseModel
      .find({ employees: employeeId })
      .populate('employees')
      .exec();
  }

  async findOneWithDetails(id: string): Promise<any> {
    const course = await this.findOne(id);
    const groups = await this.groupsService.findAll(id);
    const unassignedStudents = await this.groupsService.getUnassignedStudents(id);
    
    // Get students count
    const studentsCount = await this.studentModel.countDocuments({ 
      course: id,
      status: { $ne: 'dropped' } // Only count active and completed students
    }).exec();
    
    return {
      ...(course as any).toObject ? (course as any).toObject() : course,
      groups,
      unassignedStudents,
      studentsCount,
    };
  }

  async getCourseEmployees(courseId: string): Promise<EmployeeResponseDto[]> {
    // Validate courseId format
    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException('Invalid course ID format');
    }

    const course = await this.courseModel
      .findById(courseId)
      .lean()
      .exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if course has employees assigned
    if (!course.employees || !Array.isArray(course.employees) || course.employees.length === 0) {
      return [];
    }

    // Convert employee IDs to ObjectId array
    const employeeIds = course.employees
      .map((id: any) => {
        // Handle both string and ObjectId formats
        if (id) {
          // If it's already an ObjectId-like object
          if (typeof id === 'object' && id._id) {
            return Types.ObjectId.isValid(id._id) ? new Types.ObjectId(id._id) : null;
          }
          // If it's a string
          if (typeof id === 'string' && Types.ObjectId.isValid(id)) {
            return new Types.ObjectId(id);
          }
          // If it's already an ObjectId
          if (id instanceof Types.ObjectId) {
            return id;
          }
        }
        return null;
      })
      .filter((id: any) => id !== null) as Types.ObjectId[];

    if (employeeIds.length === 0) {
      return [];
    }

    // Find employees
    const employees = await this.employeeModel
      .find({ _id: { $in: employeeIds } })
      .lean()
      .exec();

    if (!employees || employees.length === 0) {
      return [];
    }

    // Transform employees array to frontend format
    const transformedEmployees = employees
      .map((employee: any) => {
          return {
            _id: employee._id.toString(),
            full_name: employee.name || '',
            email: employee.email || '',
            phone: employee.phone || '',
            image: employee.image || null,
            position: employee.position_id ? (typeof employee.position_id === 'object' ? employee.position_id.name : null) : null,
            department: employee.department_id ? (typeof employee.department_id === 'object' ? employee.department_id.name : null) : null,
            is_active: employee.is_active !== undefined ? employee.is_active : true,
          };
        });

    return transformedEmployees;
  }
}

