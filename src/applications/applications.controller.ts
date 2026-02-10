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
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('client')
  @ApiOperation({ summary: 'Create a new application (requires authentication - student must be registered)' })
  @ApiBody({ type: CreateApplicationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Application created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or already applied' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Student must be registered and authenticated' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all applications (admin/moderator)' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'approved', 'rejected'] })
  @ApiQuery({ name: 'courseId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'List of applications retrieved successfully',
  })
  findAll(@Query() query: {
    status?: string;
    courseId?: string;
    page?: number;
    limit?: number;
  }) {
    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get application by ID (admin/moderator)' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Application retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update application (admin/moderator)' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiBody({ type: UpdateApplicationDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Application updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete application (admin/moderator)' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Application deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(id);
  }

  @Post('bulk-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete multiple applications (admin/moderator)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          example: ['id1', 'id2', 'id3']
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Applications deleted successfully',
  })
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.applicationsService.removeMany(body.ids);
  }

  @Delete('all/delete-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete all applications (admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'All applications deleted successfully',
  })
  deleteAll() {
    return this.applicationsService.removeAll();
  }
}
