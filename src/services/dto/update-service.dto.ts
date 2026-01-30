import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiProperty({ example: 'Birlashgan Qirollik', required: false })
  @IsString()
  @IsOptional()
  name_uz?: string;

  @ApiProperty({ example: 'United Kingdom', required: false })
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiProperty({ example: 'Соединенное Королевство', required: false })
  @IsString()
  @IsOptional()
  name_ru?: string;

  @ApiProperty({ example: 'https://flagcdn.com/gb.svg', required: false })
  @IsString()
  @IsOptional()
  flag?: string;

  @ApiProperty({ example: 'UK universitetlari...', required: false })
  @IsString()
  @IsOptional()
  description_uz?: string;

  @ApiProperty({ example: 'UK universities...', required: false })
  @IsString()
  @IsOptional()
  description_en?: string;

  @ApiProperty({ example: 'Университеты Великобритании...', required: false })
  @IsString()
  @IsOptional()
  description_ru?: string;

  @ApiProperty({ example: '6.5', required: false })
  @IsString()
  @IsOptional()
  minIELTS?: string;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

