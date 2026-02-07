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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('slides')
@Controller('slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new slide (admin/moderator)' })
  @ApiResponse({ status: 201, description: 'Slide created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createSlideDto: CreateSlideDto) {
    return this.slidesService.create(createSlideDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all slides (public)' })
  @ApiResponse({ status: 200, description: 'List of all slides' })
  findAll() {
    return this.slidesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active slides (public)' })
  @ApiResponse({ status: 200, description: 'List of active slides' })
  findActive() {
    return this.slidesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a slide by ID (public)' })
  @ApiResponse({ status: 200, description: 'Slide found' })
  @ApiResponse({ status: 404, description: 'Slide not found' })
  findOne(@Param('id') id: string) {
    return this.slidesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a slide (admin/moderator)' })
  @ApiResponse({ status: 200, description: 'Slide updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Slide not found' })
  update(@Param('id') id: string, @Body() updateSlideDto: UpdateSlideDto) {
    return this.slidesService.update(id, updateSlideDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a slide (admin/moderator)' })
  @ApiResponse({ status: 200, description: 'Slide deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Slide not found' })
  remove(@Param('id') id: string) {
    return this.slidesService.remove(id);
  }
}
