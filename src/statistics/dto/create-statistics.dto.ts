import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatisticsDto {
  @ApiProperty({ example: 'Bitiruvchilar soni' })
  @IsString()
  @IsNotEmpty()
  label_uz: string;

  @ApiProperty({ example: 'Number of graduates', required: false })
  @IsString()
  @IsOptional()
  label_en?: string;

  @ApiProperty({ example: 'Количество выпускников', required: false })
  @IsString()
  @IsOptional()
  label_ru?: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({ example: 'graduation-cap', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: 'http://localhost:3000/uploads/statistics-icon.png', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

