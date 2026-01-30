import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { GroupsService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { MoveStudentDto } from './dto/move-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('groups')
@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'moderator')
@ApiBearerAuth('JWT-auth')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Group created successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
        course: { type: 'string' },
        maxStudents: { type: 'number', default: 30 },
        daysOfWeek: { type: 'array', items: { type: 'string' } },
        startTime: { type: 'string', nullable: true },
        endTime: { type: 'string', nullable: true },
        teacher: { type: 'string', nullable: true },
        students: { type: 'array', items: { type: 'string' } },
        is_active: { type: 'boolean', default: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  @ApiQuery({ name: 'courseId', required: false, description: 'Filter by course ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of groups retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          course: { type: 'string' },
          maxStudents: { type: 'number' },
          daysOfWeek: { type: 'array', items: { type: 'string' } },
          startTime: { type: 'string', nullable: true },
          endTime: { type: 'string', nullable: true },
          teacher: { type: 'string', nullable: true },
          students: { type: 'array', items: { type: 'string' } },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  findAll(@Query('courseId') courseId?: string) {
    return this.groupsService.findAll(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Group retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
        course: { type: 'string' },
        maxStudents: { type: 'number' },
        daysOfWeek: { type: 'array', items: { type: 'string' } },
        startTime: { type: 'string', nullable: true },
        endTime: { type: 'string', nullable: true },
        teacher: { type: 'string', nullable: true },
        students: { type: 'array', items: { type: 'string' } },
        is_active: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiBody({ type: UpdateGroupDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Group updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
        course: { type: 'string' },
        maxStudents: { type: 'number' },
        daysOfWeek: { type: 'array', items: { type: 'string' } },
        startTime: { type: 'string', nullable: true },
        endTime: { type: 'string', nullable: true },
        teacher: { type: 'string', nullable: true },
        students: { type: 'array', items: { type: 'string' } },
        is_active: { type: 'boolean' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Group deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Group deleted successfully' },
        deleted: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }

  @Post(':id/students')
  @ApiOperation({ summary: 'Add students to group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['studentId1', 'studentId2']
        }
      },
      required: ['studentIds']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Students added to group successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        students: { type: 'array', items: { type: 'string' } },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Group is full or invalid student IDs' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  addStudents(@Param('id') id: string, @Body() body: { studentIds: string[] }) {
    return this.groupsService.addStudentsToGroup(id, body.studentIds);
  }

  @Delete(':id/students/:studentId')
  @ApiOperation({ summary: 'Remove student from group' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Student removed from group successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        students: { type: 'array', items: { type: 'string' } },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Group or student not found' })
  removeStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
    return this.groupsService.removeStudentFromGroup(id, studentId);
  }

  @Post('move-student')
  @ApiOperation({ summary: 'Move student between groups or remove from group' })
  @ApiBody({ type: MoveStudentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Student moved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Student moved successfully' },
        student: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            groupId: { type: 'string', nullable: true }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or group is full' })
  @ApiResponse({ status: 404, description: 'Student or group not found' })
  moveStudent(
    @Body() moveStudentDto: MoveStudentDto,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.moveStudent(moveStudentDto, user._id);
  }

  @Get('course/:courseId/unassigned')
  @ApiOperation({ summary: 'Get unassigned students for a course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Unassigned students retrieved successfully',
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
          status: { type: 'string' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  getUnassignedStudents(@Param('courseId') courseId: string) {
    return this.groupsService.getUnassignedStudents(courseId);
  }

  @Get('students/:studentId/history')
  @ApiOperation({ summary: 'Get student group history' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Student history retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          groupId: { type: 'string' },
          groupName: { type: 'string' },
          joinedAt: { type: 'string', format: 'date-time' },
          leftAt: { type: 'string', format: 'date-time', nullable: true },
          reason: { type: 'string', nullable: true }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  getStudentHistory(@Param('studentId') studentId: string) {
    return this.groupsService.getStudentHistory(studentId);
  }
}

