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
import { DepartmentsService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentLoginDto } from './dto/department-login.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all active departments (public)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of active departments retrieved successfully',
  })
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all departments including inactive (moderator/admin)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all departments retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findAllAdmin() {
    return this.departmentsService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID (public)' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Department retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Department not found' })
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create department (moderator/admin)' })
  @ApiBody({ type: CreateDepartmentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Department created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update department (moderator/admin)' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiBody({ type: UpdateDepartmentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Department updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete department (moderator/admin)' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Department deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login as department head' })
  @ApiBody({ type: DepartmentLoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        refresh_token: { type: 'string' },
        department: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            code: { type: 'string' },
            head_name: { type: 'string' },
            is_active: { type: 'boolean' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: DepartmentLoginDto) {
    const department = await this.departmentsService.validateDepartment(
      loginDto.login,
      loginDto.password,
    );

    const payload = { 
      departmentId: department._id.toString(), 
      sub: department._id.toString(), 
      role: 'department_head',
      type: 'department'
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshTokenExpiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '30d';
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') || 'your-refresh-secret',
      expiresIn: refreshTokenExpiresIn,
    } as any);

    const { password: _pw, ...departmentData } = department;

    return {
      token: accessToken,
      refresh_token: refreshToken,
      department: departmentData,
    };
  }
}

