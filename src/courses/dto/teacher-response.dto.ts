import { ApiProperty } from '@nestjs/swagger';

export class TeacherResponseDto {
  @ApiProperty({ description: 'Teacher user ID' })
  _id: string;

  @ApiProperty({ description: 'Full name of the teacher' })
  full_name: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @ApiProperty({ description: 'Avatar URL', nullable: true, required: false })
  avatar_url?: string | null;

  @ApiProperty({ description: 'Is teacher active' })
  is_active: boolean;

  @ApiProperty({ description: 'User role', enum: ['admin', 'moderator', 'teacher', 'student'] })
  role: string;

  @ApiProperty({ description: 'Teacher bio', nullable: true, required: false })
  bio?: string | null;

  @ApiProperty({ description: 'Teacher specialization', nullable: true, required: false })
  specialization?: string | null;
}

