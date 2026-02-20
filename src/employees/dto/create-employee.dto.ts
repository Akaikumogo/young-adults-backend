import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'IT Specialist', enum: ['teacher', 'admin', 'moderator', 'IT Specialist', 'Manager', 'Director', 'Coordinator', 'Consultant'] })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'Description text...' })
  @IsString()
  @IsNotEmpty()
  description1: string;

  @ApiProperty({ example: '/uploads/image.jpg', description: 'Image path only, no base URL' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', required: false })
  @IsString()
  @IsOptional()
  department_id?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439013', required: false })
  @IsString()
  @IsOptional()
  position_id?: string;

  @ApiProperty({ example: 'employee_login', required: false })
  @IsString()
  @IsOptional()
  login?: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsString()
  @IsOptional()
  password?: string;
}

