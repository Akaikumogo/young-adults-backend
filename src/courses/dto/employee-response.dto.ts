import { ApiProperty } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty({ description: 'Employee ID' })
  _id: string;

  @ApiProperty({ description: 'Full name of the employee' })
  full_name: string;

  @ApiProperty({ description: 'Email of the employee' })
  email: string;

  @ApiProperty({ description: 'Phone of the employee' })
  phone: string;

  @ApiProperty({ description: 'Employee image', nullable: true, required: false })
  image?: string | null;

  @ApiProperty({ description: 'Employee position', nullable: true, required: false })
  position?: string | null;

  @ApiProperty({ description: 'Employee department', nullable: true, required: false })
  department?: string | null;

  @ApiProperty({ description: 'Is employee active' })
  is_active: boolean;
}
