import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollCourseDto {
  @ApiProperty({ example: 'courseId123', description: 'Course ID to enroll in' })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}

