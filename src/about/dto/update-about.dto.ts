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

  @ApiProperty({ example: '<h1>Young Adults – bilim, ishonch va muvaffaqiyat <span style="color: orange;">markazi!</span></h1>' })
  @IsString()
  @IsNotEmpty()
  main_title_uz: string;

  @ApiProperty({ example: '<h1>Young Adults – center of knowledge, trust and <span style="color: orange;">success!</span></h1>', required: false })
  @IsString()
  @IsOptional()
  main_title_en?: string;

  @ApiProperty({ example: '<h1>Young Adults – центр знаний, доверия и <span style="color: orange;">успеха!</span></h1>', required: false })
  @IsString()
  @IsOptional()
  main_title_ru?: string;

  @ApiProperty({ example: '<p>🎓 Young Adults o\'quv markazi 2017-yilda tashkil etilgan...</p>' })
  @IsString()
  @IsNotEmpty()
  description_uz: string;

  @ApiProperty({ example: '<p>🎓 Young Adults educational center was established in 2017...</p>', required: false })
  @IsString()
  @IsOptional()
  description_en?: string;

  @ApiProperty({ example: '<p>🎓 Образовательный центр Young Adults был основан в 2017 году...</p>', required: false })
  @IsString()
  @IsOptional()
  description_ru?: string;

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

  @ApiProperty({ example: 'https://example.com/image1.jpg', required: false })
  @IsString()
  @IsOptional()
  image1?: string;

  @ApiProperty({ example: 'https://example.com/image2.jpg', required: false })
  @IsString()
  @IsOptional()
  image2?: string;

  @ApiProperty({ example: 'https://example.com/image3.jpg', required: false })
  @IsString()
  @IsOptional()
  image3?: string;

  @ApiProperty({ example: 'https://example.com/image4.jpg', required: false })
  @IsString()
  @IsOptional()
  image4?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

