import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsObject, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ example: 'Asosiy filial' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ example: 'Main Branch', required: false })
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiProperty({ example: 'Главный филиал', required: false })
  @IsString()
  @IsOptional()
  name_ru?: string;

  @ApiProperty({ example: '123 Main St, Tashkent' })
  @IsString()
  @IsNotEmpty()
  address_uz: string;

  @ApiProperty({ example: '123 Main St, Tashkent', required: false })
  @IsString()
  @IsOptional()
  address_en?: string;

  @ApiProperty({ example: '123 Main St, Ташкент', required: false })
  @IsString()
  @IsOptional()
  address_ru?: string;

  @ApiProperty({ example: '+998901234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: { lat: 41.3111, lng: 69.2797 }, required: false })
  @IsObject()
  @IsOptional()
  coordinates?: { lat: number; lng: number };

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

