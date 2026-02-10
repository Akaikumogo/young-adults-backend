import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignEmployeeDto {
  @ApiProperty({ example: ['employeeId1', 'employeeId2'] })
  @IsArray()
  @IsNotEmpty()
  employeeIds: string[];
}
