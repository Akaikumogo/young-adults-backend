import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  /** Email yoki telefon (admin panel "login" yuboradi) */
  @ApiProperty({ example: 'admin@example.com' })
  @IsString()
  @IsOptional()
  login?: string;

  /** Agar client "email" yuborsa ham ishlaydi */
  @ApiProperty({ example: 'admin@example.com', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

