import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { StudentsService } from './student.service';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { GradeStudentDto } from './dto/grade-student.dto';
import { QueryStudentsDto } from './dto/query-students.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('students')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles('admin', 'moderator')
  @ApiOperation({ summary: 'Enroll a student (admin/moderator only)' })
  @ApiBody({ type: EnrollStudentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Student enrolled successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        full_name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        courseId: { type: 'string' },
        teacherId: { type: 'string', nullable: true },
        groupId: { type: 'string', nullable: true },
        status: { type: 'string', enum: ['active', 'completed', 'dropped'], default: 'active' },
        grades: { type: 'object', default: {} },
        attendance: { type: 'array', default: [] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() enrollStudentDto: EnrollStudentDto) {
    return this.studentsService.create(enrollStudentDto);
  }

  @Post('enroll')
  @Roles('student')
  @ApiOperation({ summary: 'Enroll yourself in a course (student only - only courseId required)' })
  @ApiBody({ type: EnrollCourseDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Successfully enrolled in course',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        full_name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        courseId: { type: 'string' },
        status: { type: 'string', enum: ['active'], default: 'active' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid course ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only students can use this endpoint' })
  enrollInCourse(@Body() enrollCourseDto: EnrollCourseDto, @CurrentUser() user: any) {
    // User info comes from JWT token
    return this.studentsService.enrollUserInCourse(user, enrollCourseDto.courseId);
  }

  @Get()
  @Roles('admin', 'moderator', 'teacher')
  @ApiOperation({ summary: 'Get all students (filtered by role)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of students retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          full_name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          courseId: { type: 'string' },
          teacherId: { type: 'string' },
          groupId: { type: 'string' },
          status: { type: 'string', enum: ['active', 'completed', 'dropped'] },
          grades: { type: 'object' },
          attendance: { type: 'array' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll(@CurrentUser() user: any) {
    // If user is a teacher, return only students from their courses
    if (user && user.role === 'teacher') {
      return this.studentsService.findByTeacherCourses(user._id.toString());
    }
    // Admin and moderator see all students
    return this.studentsService.findAll();
  }

  @Get('teacher/:teacherId')
  @Roles('admin', 'moderator', 'teacher')
  @ApiOperation({ summary: 'Get students by teacher' })
  @ApiParam({ name: 'teacherId', description: 'Teacher ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of students retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          full_name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          courseId: { type: 'string' },
          teacherId: { type: 'string' },
          groupId: { type: 'string' },
          status: { type: 'string', enum: ['active', 'completed', 'dropped'] },
          grades: { type: 'object' },
          attendance: { type: 'array' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot access other teachers students' })
  findByTeacher(@Param('teacherId') teacherId: string, @CurrentUser() user: any) {
    // Check if teacher is accessing their own students
    if (user.role === 'teacher' && user._id.toString() !== teacherId) {
      throw new Error('Unauthorized');
    }
    return this.studentsService.findByTeacher(teacherId);
  }

  @Get('course/:courseId')
  @Roles('admin', 'moderator', 'teacher')
  @ApiOperation({ summary: 'Get students by course with pagination, search and filters' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name, email, or phone' })
  @ApiQuery({ name: 'teacherId', required: false, type: String, description: 'Filter by teacher ID' })
  @ApiQuery({ name: 'groupId', required: false, type: String, description: 'Filter by group ID' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status (active, completed, dropped)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of students retrieved successfully',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  full_name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  courseId: { type: 'string' },
                  teacherId: { type: 'string' },
                  groupId: { type: 'string' },
                  status: { type: 'string' }
                }
              }
            },
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' }
          }
        },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              full_name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              courseId: { type: 'string' },
              teacherId: { type: 'string' },
              groupId: { type: 'string' },
              status: { type: 'string' }
            }
          }
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findByCourse(
    @Param('courseId') courseId: string,
    @Query() query: QueryStudentsDto,
  ) {
    // If pagination params are provided, use paginated endpoint
    if (query.page || query.limit || query.search || query.teacherId || query.groupId || query.status) {
      return this.studentsService.findByCourseWithPagination(courseId, query);
    }
    // Otherwise return all students (backward compatibility)
    return this.studentsService.findByCourse(courseId);
  }

  @Get(':id')
  @Roles('admin', 'moderator', 'teacher')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Student retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        full_name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        courseId: { type: 'string' },
        teacherId: { type: 'string' },
        groupId: { type: 'string' },
        status: { type: 'string', enum: ['active', 'completed', 'dropped'] },
        grades: { type: 'object' },
        attendance: { type: 'array' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'moderator', 'teacher')
  @ApiOperation({ summary: 'Update student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        phone: { type: 'string', example: '+998901234567' },
        courseId: { type: 'string', example: 'courseId123' },
        teacherId: { type: 'string', example: 'teacherId123' },
        groupId: { type: 'string', example: 'groupId123' },
        status: { type: 'string', enum: ['active', 'completed', 'dropped'], example: 'active' },
        grades: { 
          type: 'object', 
          additionalProperties: { type: 'number' },
          example: { 'assignment1': 85, 'assignment2': 90 }
        },
        attendance: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string', format: 'date', example: '2024-01-15' },
              present: { type: 'boolean', example: true }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Student updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        full_name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        courseId: { type: 'string' },
        teacherId: { type: 'string' },
        groupId: { type: 'string' },
        status: { type: 'string', enum: ['active', 'completed', 'dropped'] },
        grades: { type: 'object' },
        attendance: { type: 'array' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.studentsService.update(id, updateData);
  }

  @Post(':id/grade')
  @Roles('teacher', 'admin', 'moderator')
  @ApiOperation({ summary: 'Grade a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiBody({ type: GradeStudentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Student graded successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        full_name: { type: 'string' },
        grades: { 
          type: 'object',
          additionalProperties: { type: 'number' }
        },
        attendance: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string', format: 'date' },
              present: { type: 'boolean' }
            }
          }
        },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  gradeStudent(@Param('id') id: string, @Body() gradeStudentDto: GradeStudentDto) {
    return this.studentsService.gradeStudent(id, gradeStudentDto);
  }

  @Delete(':id')
  @Roles('admin', 'moderator')
  @ApiOperation({ summary: 'Delete student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Student deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Student deleted successfully' },
        deleted: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}

