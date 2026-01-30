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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { CreateStatisticsDto } from './dto/create-statistics.dto';
import { UpdateStatisticsDto } from './dto/update-statistics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active statistics (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of active statistics retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          label_uz: { type: 'string' },
          label_en: { type: 'string' },
          label_ru: { type: 'string' },
          value: { type: 'number' },
          icon: { type: 'string', nullable: true },
          order: { type: 'number' },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.statisticsService.findAll();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all statistics including inactive (moderator/admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all statistics retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          label_uz: { type: 'string' },
          label_en: { type: 'string' },
          label_ru: { type: 'string' },
          value: { type: 'number' },
          icon: { type: 'string', nullable: true },
          order: { type: 'number' },
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
    return this.statisticsService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get statistics by ID (public)' })
  @ApiParam({ name: 'id', description: 'Statistics ID' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        label_uz: { type: 'string' },
        label_en: { type: 'string' },
        label_ru: { type: 'string' },
        value: { type: 'number' },
        icon: { type: 'string', nullable: true },
        order: { type: 'number' },
        is_active: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Statistics not found' })
  findOne(@Param('id') id: string) {
    return this.statisticsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create statistics (moderator/admin)' })
  @ApiBody({ type: CreateStatisticsDto })
  @ApiResponse({
    status: 201,
    description: 'Statistics created successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        label_uz: { type: 'string' },
        label_en: { type: 'string' },
        label_ru: { type: 'string' },
        value: { type: 'number' },
        icon: { type: 'string', nullable: true },
        order: { type: 'number' },
        is_active: { type: 'boolean', default: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() createStatisticsDto: CreateStatisticsDto) {
    return this.statisticsService.create(createStatisticsDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update statistics (moderator/admin)' })
  @ApiParam({ name: 'id', description: 'Statistics ID' })
  @ApiBody({ type: UpdateStatisticsDto })
  @ApiResponse({
    status: 200,
    description: 'Statistics updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        label_uz: { type: 'string' },
        label_en: { type: 'string' },
        label_ru: { type: 'string' },
        value: { type: 'number' },
        icon: { type: 'string', nullable: true },
        order: { type: 'number' },
        is_active: { type: 'boolean' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Statistics not found' })
  update(
    @Param('id') id: string,
    @Body() updateStatisticsDto: UpdateStatisticsDto,
  ) {
    return this.statisticsService.update(id, updateStatisticsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete statistics (moderator/admin)' })
  @ApiParam({ name: 'id', description: 'Statistics ID' })
  @ApiResponse({
    status: 200,
    description: 'Statistics deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Statistics deleted successfully' },
        deleted: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Statistics not found' })
  remove(@Param('id') id: string) {
    return this.statisticsService.remove(id);
  }
}

