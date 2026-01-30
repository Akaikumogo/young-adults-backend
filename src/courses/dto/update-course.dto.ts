import { IsString, IsOptional, IsBoolean, IsArray, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiProperty({ example: 'Frontend dasturlash', required: false })
  @IsString()
  @IsOptional()
  name_uz?: string;

  @ApiProperty({ example: 'Frontend Development', required: false })
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiProperty({ example: 'Фронтенд разработка', required: false })
  @IsString()
  @IsOptional()
  name_ru?: string;

  @ApiProperty({ example: 'Frontend dasturlash kursi...', required: false })
  @IsString()
  @IsOptional()
  description_uz?: string;

  @ApiProperty({ example: 'Frontend development course...', required: false })
  @IsString()
  @IsOptional()
  description_en?: string;

  @ApiProperty({ example: 'Курс фронтенд разработки...', required: false })
  @IsString()
  @IsOptional()
  description_ru?: string;

  @ApiProperty({ example: '2 soat', required: false })
  @IsString()
  @IsOptional()
  duration_uz?: string;

  @ApiProperty({ example: '2 hours', required: false })
  @IsString()
  @IsOptional()
  duration_en?: string;

  @ApiProperty({ example: '2 часа', required: false })
  @IsString()
  @IsOptional()
  duration_ru?: string;

  @ApiProperty({ required: false, example: 3, description: 'Haftada necha kun dars' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(7)
  daysPerWeek?: number;

  @ApiProperty({ required: false, example: 2, description: 'Bir kunda necha soat dars' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(12)
  hoursPerDay?: number;

  @ApiProperty({ required: false, example: 'GraduationCap', description: 'Lucide icon nomi' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  teacherIds?: string[];

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

