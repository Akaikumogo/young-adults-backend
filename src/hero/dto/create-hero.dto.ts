import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHeroDto {
  @ApiProperty({ example: 'Asosiy sarlavha', description: 'Hero kontenti (UZ)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content_uz: string;

  @ApiProperty({ example: 'Main headline', description: 'Hero content (EN)', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content_en?: string;

  @ApiProperty({ example: 'Основной заголовок', description: 'Hero content (RU)', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content_ru?: string;

  @ApiProperty({ example: 1, description: 'Priority (small number = higher priority)' })
  @IsNumber()
  @IsNotEmpty()
  priority: number;

  @ApiProperty({
    example: '/uploads/hero-image.png',
    required: false,
    description: 'Hero image path (optional, used if video is empty). Backend returns path only, no base URL.',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    example: '/uploads/hero-video.mp4',
    required: false,
    description: 'Hero video path (optional, has priority over image on client). Backend returns path only, no base URL.',
  })
  @IsString()
  @IsOptional()
  video?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

