import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAboutDto {
  @ApiProperty({ example: 'Biz haqimizda' })
  @IsString()
  @IsNotEmpty()
  title_uz: string;

  @ApiProperty({ example: 'About Us', required: false })
  @IsString()
  @IsOptional()
  title_en?: string;

  @ApiProperty({ example: 'О нас', required: false })
  @IsString()
  @IsOptional()
  title_ru?: string;

  @ApiProperty({ example: 'Content text...' })
  @IsString()
  @IsNotEmpty()
  content_uz: string;

  @ApiProperty({ example: 'Content text...', required: false })
  @IsString()
  @IsOptional()
  content_en?: string;

  @ApiProperty({ example: 'Текст содержимого...', required: false })
  @IsString()
  @IsOptional()
  content_ru?: string;

  @ApiProperty({ example: ['https://example.com/image1.jpg'], required: false })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

