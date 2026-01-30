import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatisticsDto {
  @ApiProperty({ example: 'Bitiruvchilar soni', required: false })
  @IsString()
  @IsOptional()
  label_uz?: string;

  @ApiProperty({ example: 'Number of graduates', required: false })
  @IsString()
  @IsOptional()
  label_en?: string;

  @ApiProperty({ example: 'Количество выпускников', required: false })
  @IsString()
  @IsOptional()
  label_ru?: string;

  @ApiProperty({ example: 5000, required: false })
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiProperty({ example: 'graduation-cap', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

