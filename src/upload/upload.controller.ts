import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @Roles('admin', 'moderator', 'teacher')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({ 
    status: 201, 
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: '/uploads/filename.jpg' },
        filename: { type: 'string', example: 'original-filename.jpg' },
        size: { type: 'number', example: 1024000 },
        mimetype: { type: 'string', example: 'image/jpeg' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - No file provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file provided');
    }

    const url = await this.uploadService.saveFile(file);
    return {
      url,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Get('file/:filename(*)')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get uploaded file (protected)' })
  @ApiParam({ name: 'filename', description: 'File name' })
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    // Decode filename in case it's URL encoded
    const decodedFilename = decodeURIComponent(filename);
    const uploadPath = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadPath, decodedFilename);

    // Security: Check if file exists and is within uploads directory
    // Normalize paths to prevent directory traversal
    const normalizedFilePath = path.normalize(filePath);
    const normalizedUploadPath = path.normalize(uploadPath);
    
    if (!fs.existsSync(normalizedFilePath) || !normalizedFilePath.startsWith(normalizedUploadPath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Get file extension to determine content type
    const ext = path.extname(decodedFilename).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.sendFile(normalizedFilePath);
  }
}

