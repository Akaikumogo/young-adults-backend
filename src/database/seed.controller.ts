import { Controller, Post, Headers, ForbiddenException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SeedService } from './seed.service';

@ApiTags('client')
@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService,
    private readonly configService: ConfigService,
  ) {}

  @Post('public')
  @ApiOperation({
    summary:
      'Seed public multilingual content (idempotent, public endpoint)',
  })
  @ApiHeader({
    name: 'x-seed-token',
    required: false,
    description:
      'If SEED_PUBLIC_TOKEN is set in .env, you must pass it here.',
  })
  @ApiResponse({ status: 201, description: 'Seed executed' })
  async seedPublic(@Headers('x-seed-token') token?: string) {
    const required = this.configService.get<string>('SEED_PUBLIC_TOKEN');
    if (required && required.trim() && token !== required) {
      throw new ForbiddenException('Invalid seed token');
    }
    return this.seedService.seedPublicContent();
  }
}

