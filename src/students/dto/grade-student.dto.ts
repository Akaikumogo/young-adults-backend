import { IsString, IsNotEmpty, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GradeStudentDto {
  @ApiProperty({ example: { 'assignment1': 85, 'assignment2': 90 } })
  @IsObject()
  @IsOptional()
  grades?: { [key: string]: number };

  @ApiProperty({ example: '2024-01-15', required: false })
  @IsString()
  @IsOptional()
  attendanceDate?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  present?: boolean;
}

