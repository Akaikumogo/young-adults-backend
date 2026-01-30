import { IsString, IsNotEmpty, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVacationDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  employee_id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsNotEmpty()
  department_id: string;

  @ApiProperty({ example: 2025 })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 0, description: '0 = January, 11 = December' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(11)
  month: number;

  @ApiProperty({ example: true, required: false, default: false })
  @IsBoolean()
  @IsNotEmpty()
  has_vacation: boolean;
}

