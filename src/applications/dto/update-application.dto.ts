import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApplicationDto {
  @ApiProperty({ example: 'approved', enum: ['pending', 'approved', 'rejected'], required: false })
  @IsEnum(['pending', 'approved', 'rejected'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'Admin notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'employeeId123', required: false })
  @IsString()
  @IsOptional()
  assignedEmployeeId?: string;
}
