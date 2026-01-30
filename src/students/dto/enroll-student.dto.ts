import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'courseId123' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ example: 'teacherId123', required: false })
  @IsString()
  @IsOptional()
  teacherId?: string;

  @ApiProperty({ example: 'groupId123', required: false })
  @IsString()
  @IsOptional()
  groupId?: string;
}

