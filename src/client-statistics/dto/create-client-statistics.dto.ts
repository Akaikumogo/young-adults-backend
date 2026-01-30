import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientStatisticsDto {
  @ApiProperty({ example: 'graduation-cap', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: 'Bitiruvchilar', required: false })
  @IsString()
  @IsOptional()
  title_uz?: string;

  @ApiProperty({ example: 'Graduates', required: false })
  @IsString()
  @IsOptional()
  title_en?: string;

  @ApiProperty({ example: 'Выпускники', required: false })
  @IsString()
  @IsOptional()
  title_ru?: string;

  @ApiProperty({ example: '5000', description: 'Can be a number or text' })
  @IsNotEmpty()
  value: string | number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
