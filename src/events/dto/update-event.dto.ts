import { IsString, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiProperty({ example: 'Tadbir nomi', required: false })
  @IsString()
  @IsOptional()
  eventTitle_uz?: string;

  @ApiProperty({ example: 'Event Title', required: false })
  @IsString()
  @IsOptional()
  eventTitle_en?: string;

  @ApiProperty({ example: 'Название события', required: false })
  @IsString()
  @IsOptional()
  eventTitle_ru?: string;

  @ApiProperty({ example: 'Tadbir tavsifi...', required: false })
  @IsString()
  @IsOptional()
  eventDescription_uz?: string;

  @ApiProperty({ example: 'Event description...', required: false })
  @IsString()
  @IsOptional()
  eventDescription_en?: string;

  @ApiProperty({ example: 'Описание события...', required: false })
  @IsString()
  @IsOptional()
  eventDescription_ru?: string;

  @ApiProperty({ example: 'https://example.com/event-image.jpg', required: false })
  @IsString()
  @IsOptional()
  @IsUrl()
  eventImage?: string;

  @ApiProperty({ example: 'https://example.com/event-video.mp4', required: false })
  @IsString()
  @IsOptional()
  @IsUrl()
  eventVideo?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
