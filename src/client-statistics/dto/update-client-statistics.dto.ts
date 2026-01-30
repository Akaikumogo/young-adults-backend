import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientStatisticsDto {
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

  @ApiProperty({ example: '5000', required: false, description: 'Can be a number or text' })
  @IsOptional()
  value?: string | number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
