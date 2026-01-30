import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { VacationsService } from './vacation.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { GetVacationsDto } from './dto/get-vacations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('vacations')
@Controller('vacations')
export class VacationsController {
  constructor(private readonly vacationsService: VacationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get vacations with optional filters (public)' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'department_id', required: false, type: String })
  @ApiQuery({ name: 'employee_id', required: false, type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'List of vacations retrieved successfully',
  })
  findAll(@Query() query: GetVacationsDto) {
    return this.vacationsService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get vacation statistics by year and department (public)' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Vacation statistics retrieved successfully',
  })
  getStats(@Query('year') year: number) {
    return this.vacationsService.getVacationStatsByYearAndDepartment(year);
  }

  @Get('employee/:employeeId/year/:year')
  @ApiOperation({ summary: 'Get vacations for employee by year (public)' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  @ApiParam({ name: 'year', description: 'Year' })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee vacations retrieved successfully',
  })
  findByEmployeeAndYear(
    @Param('employeeId') employeeId: string,
    @Param('year') year: number,
  ) {
    return this.vacationsService.findByEmployeeAndYear(employeeId, year);
  }

  @Get('department/:departmentId/year/:year')
  @ApiOperation({ summary: 'Get vacations for department by year (public)' })
  @ApiParam({ name: 'departmentId', description: 'Department ID' })
  @ApiParam({ name: 'year', description: 'Year' })
  @ApiResponse({ 
    status: 200, 
    description: 'Department vacations retrieved successfully',
  })
  findByDepartmentAndYear(
    @Param('departmentId') departmentId: string,
    @Param('year') year: number,
  ) {
    return this.vacationsService.findByDepartmentAndYear(departmentId, year);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vacation by ID (public)' })
  @ApiParam({ name: 'id', description: 'Vacation ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Vacation retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Vacation not found' })
  findOne(@Param('id') id: string) {
    return this.vacationsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin', 'department_head')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create vacation (moderator/admin/department_head)' })
  @ApiBody({ type: CreateVacationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Vacation created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() createVacationDto: CreateVacationDto) {
    return this.vacationsService.create(createVacationDto);
  }

  @Post('upsert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin', 'department_head')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create or update vacation (moderator/admin/department_head)' })
  @ApiBody({ type: CreateVacationDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Vacation created or updated successfully',
  })
  upsert(@Body() createVacationDto: CreateVacationDto) {
    return this.vacationsService.upsertVacation(createVacationDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin', 'department_head')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update vacation (moderator/admin/department_head)' })
  @ApiParam({ name: 'id', description: 'Vacation ID' })
  @ApiBody({ type: UpdateVacationDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Vacation updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Vacation not found' })
  update(@Param('id') id: string, @Body() updateVacationDto: UpdateVacationDto) {
    return this.vacationsService.update(id, updateVacationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete vacation (moderator/admin)' })
  @ApiParam({ name: 'id', description: 'Vacation ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Vacation deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Vacation not found' })
  remove(@Param('id') id: string) {
    return this.vacationsService.remove(id);
  }
}

