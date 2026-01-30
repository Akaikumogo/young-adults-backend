import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CoursesService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request } from 'express';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get all courses (filtered by role - public access with optional auth)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of courses retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          duration: { type: 'string' },
          price: { type: 'number' },
          image_url: { type: 'string', nullable: true },
          teachers: { type: 'array', items: { type: 'string' } },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  findAll(@Req() req: Request) {
    // Check if user is authenticated (from JWT guard if token is present)
    const user = (req as any).user;
    
    // If user is a teacher, return only their courses
    if (user && user.role === 'teacher') {
      return this.coursesService.findByTeacher(user._id.toString());
    }
    // Admin, moderator, and unauthenticated users see all courses
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID (public)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Course retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        duration: { type: 'string' },
        price: { type: 'number' },
        image_url: { type: 'string', nullable: true },
        teachers: { type: 'array', items: { type: 'string' } },
        is_active: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Get(':id/details')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator', 'teacher')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get course details with groups and unassigned students' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Course details retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        course: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' }
          }
        },
        groups: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              students: { type: 'array', items: { type: 'string' } }
            }
          }
        },
        unassignedStudents: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              full_name: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOneWithDetails(@Param('id') id: string) {
    return this.coursesService.findOneWithDetails(id);
  }

  @Get(':id/teachers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator', 'teacher')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get teachers assigned to a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of teachers retrieved successfully',
    type: [TeacherResponseDto]
  })
  @ApiResponse({ status: 400, description: 'Invalid course ID format' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  getCourseTeachers(@Param('id') id: string): Promise<TeacherResponseDto[]> {
    return this.coursesService.getCourseTeachers(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create course (moderator/admin)' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Course created successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        duration: { type: 'string' },
        price: { type: 'number' },
        image_url: { type: 'string', nullable: true },
        teachers: { type: 'array', items: { type: 'string' } },
        is_active: { type: 'boolean', default: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update course (moderator/admin)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Course updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        duration: { type: 'string' },
        price: { type: 'number' },
        image_url: { type: 'string', nullable: true },
        teachers: { type: 'array', items: { type: 'string' } },
        is_active: { type: 'boolean' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete course (moderator/admin)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Course deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Course deleted successfully' },
        deleted: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Post(':id/assign-teacher')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Assign teachers to course (moderator/admin)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiBody({ type: AssignTeacherDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Teachers assigned successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        title: { type: 'string' },
        teachers: { type: 'array', items: { type: 'string' } },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid teacher IDs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  assignTeachers(@Param('id') id: string, @Body() assignTeacherDto: AssignTeacherDto) {
    return this.coursesService.assignTeachers(id, assignTeacherDto);
  }
}

