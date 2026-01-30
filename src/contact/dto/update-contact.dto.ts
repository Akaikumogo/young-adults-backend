import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactDto {
  @ApiProperty({ example: 'read', enum: ['new', 'read', 'replied'], required: false })
  @IsEnum(['new', 'read', 'replied'])
  @IsOptional()
  status?: string;
}

