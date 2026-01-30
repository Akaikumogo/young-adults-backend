import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MoveStudentDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  studentId: string;

  @ApiProperty({ required: false, example: '507f1f77bcf86cd799439012' })
  @IsMongoId()
  @IsOptional()
  toGroupId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

