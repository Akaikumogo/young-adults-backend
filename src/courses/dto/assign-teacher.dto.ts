import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTeacherDto {
  @ApiProperty({ example: ['teacherId1', 'teacherId2'] })
  @IsArray()
  @IsNotEmpty()
  teacherIds: string[];
}

