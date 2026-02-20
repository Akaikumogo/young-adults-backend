import { IsString, IsOptional, IsNumber, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHeroDto {
  @ApiProperty({ example: 'Asosiy sarlavha', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content_uz?: string;

  @ApiProperty({ example: 'Main headline', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content_en?: string;

  @ApiProperty({ example: 'Основной заголовок', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content_ru?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiProperty({ example: '/uploads/hero-image.png', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: '/uploads/hero-video.mp4', required: false })
  @IsString()
  @IsOptional()
  video?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

