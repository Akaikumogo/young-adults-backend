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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ClientStatisticsService } from './client-statistics.service';
import { CreateClientStatisticsDto } from './dto/create-client-statistics.dto';
import { UpdateClientStatisticsDto } from './dto/update-client-statistics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('client-statistics')
@Controller('client-statistics')
export class ClientStatisticsController {
  constructor(private readonly clientStatisticsService: ClientStatisticsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create client statistics (moderator/admin)' })
  @ApiBody({ type: CreateClientStatisticsDto })
  @ApiResponse({
    status: 201,
    description: 'Client statistics created successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        icon: { type: 'string', nullable: true },
        title_uz: { type: 'string', nullable: true },
        title_en: { type: 'string', nullable: true },
        title_ru: { type: 'string', nullable: true },
        value: { oneOf: [{ type: 'string' }, { type: 'number' }] },
        is_active: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() createDto: CreateClientStatisticsDto) {
    return this.clientStatisticsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active client statistics (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of active client statistics retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          icon: { type: 'string', nullable: true },
          title_uz: { type: 'string', nullable: true },
          title_en: { type: 'string', nullable: true },
          title_ru: { type: 'string', nullable: true },
          value: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.clientStatisticsService.findAll();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all client statistics including inactive (moderator/admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of all client statistics retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          icon: { type: 'string', nullable: true },
          title_uz: { type: 'string', nullable: true },
          title_en: { type: 'string', nullable: true },
          title_ru: { type: 'string', nullable: true },
          value: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findAllAdmin() {
    return this.clientStatisticsService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client statistics by ID (public)' })
  @ApiResponse({
    status: 200,
    description: 'Client statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        icon: { type: 'string', nullable: true },
        title_uz: { type: 'string', nullable: true },
        title_en: { type: 'string', nullable: true },
        title_ru: { type: 'string', nullable: true },
        value: { oneOf: [{ type: 'string' }, { type: 'number' }] },
        is_active: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Client statistics not found' })
  findOne(@Param('id') id: string) {
    return this.clientStatisticsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update client statistics (moderator/admin)' })
  @ApiBody({ type: UpdateClientStatisticsDto })
  @ApiResponse({
    status: 200,
    description: 'Client statistics updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        icon: { type: 'string', nullable: true },
        title_uz: { type: 'string', nullable: true },
        title_en: { type: 'string', nullable: true },
        title_ru: { type: 'string', nullable: true },
        value: { oneOf: [{ type: 'string' }, { type: 'number' }] },
        is_active: { type: 'boolean' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Client statistics not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateClientStatisticsDto) {
    return this.clientStatisticsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete client statistics (moderator/admin)' })
  @ApiResponse({ status: 200, description: 'Client statistics deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Client statistics not found' })
  remove(@Param('id') id: string) {
    return this.clientStatisticsService.remove(id);
  }
}
