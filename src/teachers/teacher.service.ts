import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CoursesService } from '../courses/course.service';
import { StudentsService } from '../students/student.service';
import { UsersService } from '../users/user.service';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async create(userId: string, bio?: string, specialization?: string): Promise<Teacher> {
    // Check if teacher already exists
    const existing = await this.teacherModel.findOne({ user: userId }).exec();
    if (existing) {
      throw new ConflictException('Teacher profile already exists for this user');
    }

    const teacher = new this.teacherModel({
      user: userId,
      bio,
      specialization,
    });

    return teacher.save();
  }

  async findAll(): Promise<any[]> {
    // Get all users with role='teacher'
    const teacherUsers = await this.usersService.findAll();
    const teachersWithRole = teacherUsers.filter(user => user.role === 'teacher');
    
    // Get all teacher entities
    const teacherEntities = await this.teacherModel.find().populate('user').populate('courses').exec();
    
    // Create a map of userId -> Teacher entity
    const teacherMap = new Map();
    teacherEntities.forEach(teacher => {
      const userId = teacher.user._id?.toString() || teacher.user.toString();
      teacherMap.set(userId, teacher);
    });
    
    // Combine: for each teacher user, include their Teacher entity if exists
    const result = teachersWithRole.map(user => {
      const userId = user._id.toString();
      const teacherEntity = teacherMap.get(userId);
      
      if (teacherEntity) {
        // Teacher entity exists, return it with populated user
        return teacherEntity;
      } else {
        // No Teacher entity, create a virtual teacher object
        return {
          _id: userId,
          user: user,
          bio: null,
          specialization: null,
          courses: [],
          students: [],
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }
    });
    
    return result;
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel
      .findById(id)
      .populate('user')
      .populate('courses')
      .exec();

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async findByUserId(userId: string): Promise<Teacher | null> {
    return this.teacherModel.findOne({ user: userId }).populate('user').populate('courses').exec();
  }

  async getTeacherCourses(teacherId: string) {
    const teacher = await this.findOne(teacherId);
    return teacher.courses;
  }

  async getTeacherStudents(teacherId: string) {
    return this.studentsService.findByTeacher(teacherId);
  }
}

