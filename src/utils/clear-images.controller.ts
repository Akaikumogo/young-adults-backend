import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ClearImagesService } from './clear-images.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('utils')
@Controller('utils')
export class ClearImagesController {
  constructor(private readonly clearImagesService: ClearImagesService) {}

  @Post('clear-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Clear all image references (admin only)',
    description: 'Sets all image fields to null across all collections. Use when server is changed.'
  })
  @ApiResponse({
    status: 200,
    description: 'All image references cleared successfully',
    schema: {
      type: 'object',
      properties: {
        events: { type: 'number', description: 'Number of events updated' },
        employees: { type: 'number', description: 'Number of employees updated' },
        users: { type: 'number', description: 'Number of users updated' },
        courses: { type: 'number', description: 'Number of courses updated' },
        about: { type: 'number', description: 'Number of about records updated' },
        locations: { type: 'number', description: 'Number of locations updated' },
        services: { type: 'number', description: 'Number of services updated' },
        total: { type: 'number', description: 'Total number of records updated' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async clearAllImages() {
    return this.clearImagesService.clearAllImages();
  }
}
