import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TeachersService } from './teacher.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all teachers (admin/moderator)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of teachers retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          user: { type: 'string' },
          specialization: { type: 'string' },
          experience: { type: 'number' },
          bio: { type: 'string', nullable: true },
          courses: { type: 'array', items: { type: 'string' } },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get teacher by ID' })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Teacher retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            full_name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            avatar_url: { type: 'string', nullable: true }
          }
        },
        specialization: { type: 'string' },
        experience: { type: 'number' },
        bio: { type: 'string', nullable: true },
        courses: { type: 'array', items: { type: 'string' } },
        is_active: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Get(':id/courses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get teacher courses' })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of teacher courses retrieved successfully',
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
          is_active: { type: 'boolean' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot access other teachers courses' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async getCourses(@Param('id') id: string, @CurrentUser() user: any) {
    // Check if teacher is accessing their own courses or admin/moderator
    const teacher = await this.teachersService.findOne(id);
    if (user.role !== 'admin' && user.role !== 'moderator' && teacher.user.toString() !== user._id.toString()) {
      throw new Error('Unauthorized');
    }
    return this.teachersService.getTeacherCourses(id);
  }

  @Get(':id/students')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get teacher students' })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of teacher students retrieved successfully',
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
          groupId: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['active', 'completed', 'dropped'] },
          grades: { type: 'object' },
          attendance: { type: 'array' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot access other teachers students' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async getStudents(@Param('id') id: string, @CurrentUser() user: any) {
    // Check if teacher is accessing their own students or admin/moderator
    const teacher = await this.teachersService.findOne(id);
    if (user.role !== 'admin' && user.role !== 'moderator' && teacher.user.toString() !== user._id.toString()) {
      throw new Error('Unauthorized');
    }
    return this.teachersService.getTeacherStudents(id);
  }
}

