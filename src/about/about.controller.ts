import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('about')
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @ApiOperation({ summary: 'Get about content (public)' })
  @ApiResponse({ 
    status: 200, 
    description: 'About content retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        images: { type: 'array', items: { type: 'string' } },
        is_active: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  findOne() {
    return this.aboutService.findOne();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get about content for admin (moderator/admin)' })
  @ApiResponse({ 
    status: 200, 
    description: 'About content retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        images: { type: 'array', items: { type: 'string' } },
        is_active: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findOneAdmin() {
    return this.aboutService.findOneAdmin();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update about content (moderator/admin)' })
  @ApiBody({ type: UpdateAboutDto })
  @ApiResponse({ 
    status: 200, 
    description: 'About content updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        images: { type: 'array', items: { type: 'string' } },
        is_active: { type: 'boolean' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  update(@Body() updateAboutDto: UpdateAboutDto) {
    return this.aboutService.createOrUpdate(updateAboutDto);
  }
}

