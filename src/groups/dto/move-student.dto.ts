import { IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MoveStudentDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ required: false, example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  @IsOptional()
  toGroupId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
