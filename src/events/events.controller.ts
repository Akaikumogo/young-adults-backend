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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create event (moderator/admin)' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        eventTitle_uz: { type: 'string' },
        eventTitle_en: { type: 'string' },
        eventTitle_ru: { type: 'string' },
        eventDescription_uz: { type: 'string' },
        eventDescription_en: { type: 'string' },
        eventDescription_ru: { type: 'string' },
        eventImage: { type: 'string' },
        eventVideo: { type: 'string', nullable: true },
        is_active: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiTags('client')
  @ApiOperation({ summary: 'Get all active events (public - for landing page)' })
  @ApiResponse({
    status: 200,
    description: 'List of active events retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          eventTitle_uz: { type: 'string' },
          eventTitle_en: { type: 'string' },
          eventTitle_ru: { type: 'string' },
          eventDescription_uz: { type: 'string' },
          eventDescription_en: { type: 'string' },
          eventDescription_ru: { type: 'string' },
          eventImage: { type: 'string' },
          eventVideo: { type: 'string', nullable: true },
          is_active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all events including inactive (moderator/admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of all events retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          eventTitle_uz: { type: 'string' },
          eventTitle_en: { type: 'string' },
          eventTitle_ru: { type: 'string' },
          eventDescription_uz: { type: 'string' },
          eventDescription_en: { type: 'string' },
          eventDescription_ru: { type: 'string' },
          eventImage: { type: 'string' },
          eventVideo: { type: 'string', nullable: true },
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
    return this.eventsService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID (public)' })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        eventTitle_uz: { type: 'string' },
        eventTitle_en: { type: 'string' },
        eventTitle_ru: { type: 'string' },
        eventDescription_uz: { type: 'string' },
        eventDescription_en: { type: 'string' },
        eventDescription_ru: { type: 'string' },
        eventImage: { type: 'string' },
        eventVideo: { type: 'string', nullable: true },
        is_active: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update event (moderator/admin)' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        eventTitle_uz: { type: 'string' },
        eventTitle_en: { type: 'string' },
        eventTitle_ru: { type: 'string' },
        eventDescription_uz: { type: 'string' },
        eventDescription_en: { type: 'string' },
        eventDescription_ru: { type: 'string' },
        eventImage: { type: 'string' },
        eventVideo: { type: 'string', nullable: true },
        is_active: { type: 'boolean' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete event (moderator/admin)' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
