import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ example: 'Frontend Group A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 'Morning group for beginners' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  course: string;

  @ApiProperty({ required: false, example: 30, default: 30 })
  @IsNumber()
  @IsOptional()
  maxStudents?: number;

  @ApiProperty({ required: false, example: ['Monday', 'Wednesday', 'Friday'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  daysOfWeek?: string[];

  @ApiProperty({ required: false, example: '09:00' })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiProperty({ required: false, example: '11:00' })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiProperty({ required: false, example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsOptional()
  employee?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

