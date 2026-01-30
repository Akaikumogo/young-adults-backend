import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { EmployeesService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ChangeEmployeePasswordDto } from './dto/change-employee-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active employees (public)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of active employees retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string' },
          birth: { type: 'string' },
          description1: { type: 'string' },
          image: { type: 'string' },
          slug: { type: 'string' },
          order: { type: 'number' },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  findAll() {
    return this.employeesService.findAll();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all employees including inactive (moderator/admin)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all employees retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string' },
          birth: { type: 'string' },
          description1: { type: 'string' },
          image: { type: 'string' },
          slug: { type: 'string' },
          order: { type: 'number' },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findAllAdmin() {
    return this.employeesService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID (public)' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string' },
        birth: { type: 'string' },
        description1: { type: 'string' },
        image: { type: 'string' },
        slug: { type: 'string' },
        order: { type: 'number' },
        is_active: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create employee (moderator/admin)' })
  @ApiBody({ type: CreateEmployeeDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Employee created successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string' },
        birth: { type: 'string' },
        description1: { type: 'string' },
        image: { type: 'string' },
        slug: { type: 'string' },
        order: { type: 'number' },
        is_active: { type: 'boolean', default: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update employee (moderator/admin)' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string' },
        birth: { type: 'string' },
        description1: { type: 'string' },
        image: { type: 'string' },
        slug: { type: 'string' },
        order: { type: 'number' },
        is_active: { type: 'boolean' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete employee (moderator/admin)' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Employee deleted successfully' },
        deleted: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change employee password (moderator/admin)' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiBody({ type: ChangeEmployeePasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password changed successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangeEmployeePasswordDto
  ) {
    return this.employeesService.changePassword(id, changePasswordDto.newPassword).then(() => ({
      message: 'Password changed successfully'
    }));
  }
}

