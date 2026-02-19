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
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('hero')
@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  @ApiTags('client', 'hero')
  @ApiOperation({ summary: 'Get all active hero items (public - for landing page)' })
  @ApiResponse({ status: 200, description: 'List of hero items retrieved successfully' })
  findAllPublic() {
    return this.heroService.findAllPublic();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all hero items (admin/moderator)' })
  @ApiResponse({ status: 200, description: 'List of hero items retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findAllAdmin() {
    return this.heroService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hero item by ID (public)' })
  @ApiParam({ name: 'id', description: 'Hero ID' })
  @ApiResponse({ status: 200, description: 'Hero item retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Hero not found' })
  findOne(@Param('id') id: string) {
    return this.heroService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create hero item (admin/moderator)' })
  @ApiBody({ type: CreateHeroDto })
  @ApiResponse({ status: 201, description: 'Hero item created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() createHeroDto: CreateHeroDto) {
    return this.heroService.create(createHeroDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update hero item (admin/moderator)' })
  @ApiParam({ name: 'id', description: 'Hero ID' })
  @ApiBody({ type: UpdateHeroDto })
  @ApiResponse({ status: 200, description: 'Hero item updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Hero not found' })
  update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
    return this.heroService.update(id, updateHeroDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete hero item (admin/moderator)' })
  @ApiParam({ name: 'id', description: 'Hero ID' })
  @ApiResponse({ status: 200, description: 'Hero item deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Hero not found' })
  remove(@Param('id') id: string) {
    return this.heroService.remove(id);
  }
}

