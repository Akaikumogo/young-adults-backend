import { Injectable, NotFoundException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { Teacher, TeacherDocument } from '../teachers/schemas/teacher.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { GroupsService } from '../groups/group.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => GroupsService))
    private groupsService: GroupsService,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    // Convert teacherIds to teachers ObjectId array
    const courseData: any = { ...createCourseDto };
    
    if (createCourseDto.teacherIds && createCourseDto.teacherIds.length > 0) {
      // Validate and convert teacherIds to ObjectId array
      try {
        courseData.teachers = createCourseDto.teacherIds.map(id => {
          if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid teacher ID: ${id}`);
          }
          return new Types.ObjectId(id);
        });
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new BadRequestException('Invalid teacher IDs format');
      }
      delete courseData.teacherIds;
    } else {
      courseData.teachers = [];
    }

    const course = new this.courseModel(courseData);
    return course.save();
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().populate('teachers').exec();
  }

  async findOne(id: string): Promise<any> {
    // Validate courseId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid course ID format');
    }

    const course = await this.courseModel
      .findById(id)
      .populate({
        path: 'teachers',
        populate: {
          path: 'user',
          select: 'full_name email phone avatar_url is_active role',
        },
      })
      .lean()
      .exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Transform teachers array to include full user data
    if (course.teachers && Array.isArray(course.teachers) && course.teachers.length > 0) {
      const transformedTeachers = course.teachers
        .filter((teacher: any) => {
          return teacher && typeof teacher === 'object' && teacher._id && teacher.user;
        })
        .map((teacher: any) => {
          if (teacher.user && typeof teacher.user === 'object' && teacher.user._id) {
            return {
              _id: teacher.user._id.toString(),
              full_name: teacher.user.full_name || '',
              email: teacher.user.email || '',
              phone: teacher.user.phone || '',
              avatar_url: teacher.user.avatar_url || null,
              is_active: teacher.user.is_active !== undefined ? teacher.user.is_active : true,
              role: (teacher.user.role || 'teacher') as string,
              bio: teacher.bio || null,
              specialization: teacher.specialization || null,
            };
          }
          return null;
        })
        .filter((teacher: any) => teacher !== null);

      return {
        ...course,
        teachers: transformedTeachers,
      };
    }

    return {
      ...course,
      teachers: [],
    };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    // Convert teacherIds to teachers ObjectId array if provided
    const updateData: any = { ...updateCourseDto };
    
    if (updateCourseDto.teacherIds !== undefined) {
      if (updateCourseDto.teacherIds.length > 0) {
        // Validate and convert teacherIds to ObjectId array
        try {
          updateData.teachers = updateCourseDto.teacherIds.map(id => {
            if (!Types.ObjectId.isValid(id)) {
              throw new BadRequestException(`Invalid teacher ID: ${id}`);
            }
            return new Types.ObjectId(id);
          });
        } catch (error) {
          if (error instanceof BadRequestException) {
            throw error;
          }
          throw new BadRequestException('Invalid teacher IDs format');
        }
      } else {
        updateData.teachers = [];
      }
      delete updateData.teacherIds;
    }

    const course = await this.courseModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('teachers')
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

  async assignTeachers(id: string, assignTeacherDto: AssignTeacherDto): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Validate and convert teacherIds to ObjectId array
    try {
      course.teachers = assignTeacherDto.teacherIds.map(id => {
        if (!Types.ObjectId.isValid(id)) {
          throw new BadRequestException(`Invalid teacher ID: ${id}`);
        }
        return new Types.ObjectId(id);
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid teacher IDs format');
    }

    return course.save();
  }

  async findByTeacher(teacherUserId: string): Promise<Course[]> {
    // Find the Teacher entity by user ID
    const teacher = await this.teacherModel.findOne({ user: teacherUserId }).exec();
    
    if (!teacher) {
      // If no teacher entity exists, return empty array
      return [];
    }
    
    // Find courses where the teacher's _id is in the teachers array
    // Course.teachers contains Teacher ObjectIds
    return this.courseModel
      .find({ teachers: teacher._id })
      .populate('teachers')
      .exec();
  }

  async findOneWithDetails(id: string): Promise<any> {
    const course = await this.findOne(id);
    const groups = await this.groupsService.findAll(id);
    const unassignedStudents = await this.groupsService.getUnassignedStudents(id);
    
    return {
      ...(course as any).toObject ? (course as any).toObject() : course,
      groups,
      unassignedStudents,
    };
  }

  async getCourseTeachers(courseId: string): Promise<TeacherResponseDto[]> {
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

    // Debug: Log course teachers
    console.log('Course teachers (raw):', course.teachers);
    console.log('Course teachers type:', typeof course.teachers);
    console.log('Course teachers is array:', Array.isArray(course.teachers));

    // Check if course has teachers assigned
    if (!course.teachers || !Array.isArray(course.teachers) || course.teachers.length === 0) {
      console.log('No teachers assigned to course');
      return [];
    }

    // Convert teacher IDs to ObjectId array
    const teacherIds = course.teachers
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

    console.log('Converted teacher IDs:', teacherIds.map(id => id.toString()));

    if (teacherIds.length === 0) {
      console.log('No valid teacher IDs found');
      return [];
    }

    // First, try to find teachers by Teacher collection
    let teachers = await this.teacherModel
      .find({ _id: { $in: teacherIds } })
      .populate({
        path: 'user',
        select: 'full_name email phone avatar_url is_active role',
        model: 'User',
      })
      .lean()
      .exec();

    console.log('Found teachers in Teacher collection:', teachers?.length || 0);

    // If no teachers found in Teacher collection, try to find by User collection
    // This handles the case where Course.teachers might contain User IDs instead of Teacher IDs
    if (!teachers || teachers.length === 0) {
      console.log('No teachers found in Teacher collection, trying User collection...');
      
      // Find users with teacher role
      const users = await this.userModel
        .find({ 
          _id: { $in: teacherIds },
          role: 'teacher'
        })
        .select('full_name email phone avatar_url is_active role')
        .lean()
        .exec();

      console.log('Found users with teacher role:', users?.length || 0);

      if (users && users.length > 0) {
        // Transform users to teacher format
        const transformedTeachers = users.map((user: any) => {
          return {
            _id: user._id.toString(),
            full_name: user.full_name || '',
            email: user.email || '',
            phone: user.phone || '',
            avatar_url: user.avatar_url || null,
            is_active: user.is_active !== undefined ? user.is_active : true,
            role: (user.role || 'teacher') as string,
            bio: null,
            specialization: null,
          };
        });

        console.log('Transformed users to teachers:', transformedTeachers.length);
        return transformedTeachers;
      }

      console.log('No teachers found in User collection either');
      return [];
    }

    // Transform teachers array to frontend format
    const transformedTeachers = teachers
      .filter((teacher: any) => {
        // Only include if teacher has populated user
        const hasUser = teacher && teacher.user && typeof teacher.user === 'object' && teacher.user._id;
        if (!hasUser) {
          console.log('Teacher without user:', teacher._id);
        }
        return hasUser;
      })
      .map((teacher: any) => {
        return {
          _id: teacher.user._id.toString(),
          full_name: teacher.user.full_name || '',
          email: teacher.user.email || '',
          phone: teacher.user.phone || '',
          avatar_url: teacher.user.avatar_url || null,
          is_active: teacher.user.is_active !== undefined ? teacher.user.is_active : true,
          role: (teacher.user.role || 'teacher') as string,
          bio: teacher.bio || null,
          specialization: teacher.specialization || null,
        };
      });

    console.log('Transformed teachers:', transformedTeachers.length);
    return transformedTeachers;
  }
}

