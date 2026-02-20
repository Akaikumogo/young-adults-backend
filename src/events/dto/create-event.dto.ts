import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Tadbir nomi' })
  @IsString()
  @IsNotEmpty()
  eventTitle_uz: string;

  @ApiProperty({ example: 'Event Title', required: false })
  @IsString()
  @IsOptional()
  eventTitle_en?: string;

  @ApiProperty({ example: 'Название события', required: false })
  @IsString()
  @IsOptional()
  eventTitle_ru?: string;

  @ApiProperty({ example: 'Tadbir tavsifi...' })
  @IsString()
  @IsNotEmpty()
  eventDescription_uz: string;

  @ApiProperty({ example: 'Event description...', required: false })
  @IsString()
  @IsOptional()
  eventDescription_en?: string;

  @ApiProperty({ example: 'Описание события...', required: false })
  @IsString()
  @IsOptional()
  eventDescription_ru?: string;

  @ApiProperty({ example: '/uploads/event-image.jpg', required: false })
  @IsString()
  @IsOptional()
  eventImage?: string;

  @ApiProperty({ example: '/uploads/event-video.mp4', required: false, description: 'Video path only, no base URL' })
  @IsString()
  @IsOptional()
  eventVideo?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
