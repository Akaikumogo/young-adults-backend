import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSlideDto {
  @ApiProperty({ description: 'Slide title in Uzbek' })
  @IsString()
  @IsNotEmpty()
  title_uz: string;

  @ApiPropertyOptional({ description: 'Slide title in English', default: '' })
  @IsString()
  @IsOptional()
  title_en?: string;

  @ApiPropertyOptional({ description: 'Slide title in Russian', default: '' })
  @IsString()
  @IsOptional()
  title_ru?: string;

  @ApiProperty({ description: 'Slide description in Uzbek' })
  @IsString()
  @IsNotEmpty()
  description_uz: string;

  @ApiPropertyOptional({ description: 'Slide description in English', default: '' })
  @IsString()
  @IsOptional()
  description_en?: string;

  @ApiPropertyOptional({ description: 'Slide description in Russian', default: '' })
  @IsString()
  @IsOptional()
  description_ru?: string;

  @ApiProperty({ description: 'Slide image URL' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiPropertyOptional({ description: 'Slide video URL' })
  @IsString()
  @IsOptional()
  video?: string;

  @ApiPropertyOptional({ description: 'Display order', default: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Is slide active', default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
