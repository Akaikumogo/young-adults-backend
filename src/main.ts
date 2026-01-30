import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response } from 'express';
import { NoCacheInterceptor } from './common/interceptors/no-cache.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/'
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  // Global interceptor to disable HTTP cache (prevent 304 responses)
  // Frontend (RTK Query) will handle caching internally
  app.useGlobalInterceptors(new NoCacheInterceptor());

  // Trust proxy to get correct origin from X-Forwarded-* headers
  app.set('trust proxy', true);

  // CORS configuration
  app.enableCors({
    origin: true,
    credentials: true
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Young Adults Educational Center Backend')
    .setDescription(
      `
      Complete API documentation for Young Adults Educational Center Backend.
      
      ## Authentication
      Most endpoints require JWT authentication. Use the login endpoint to obtain a token, then click the "Authorize" button above and enter your token.
      
      ## Roles
      - **admin**: Full access to all endpoints
      - **moderator**: Can manage courses, services, employees, locations, groups, and students
      - **teacher**: Can view assigned courses and grade students
      - **student**: Can enroll in courses
      
      ## Endpoints
      - **auth**: Authentication and user management
      - **users**: User CRUD operations (admin/moderator only)
      - **courses**: Course management
      - **students**: Student enrollment and management
      - **groups**: Group management
      - **teachers**: Teacher information
      - **services**: Service management
      - **employees**: Employee management
      - **locations**: Location management
      - **about**: About page content
      - **contact**: Contact form submissions
      - **upload**: File upload functionality
    `
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token obtained from /auth/login endpoint',
        in: 'header'
      },
      'JWT-auth'
    )
    .addTag('health', 'Health check endpoints')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('courses', 'Course management endpoints')
    .addTag('students', 'Student management endpoints')
    .addTag('groups', 'Group management endpoints')
    .addTag('teachers', 'Teacher endpoints')
    .addTag('services', 'Service management endpoints')
    .addTag('employees', 'Employee management endpoints')
    .addTag('locations', 'Location management endpoints')
    .addTag('about', 'About page endpoints')
    .addTag('contact', 'Contact form endpoints')
    .addTag('upload', 'File upload endpoints')
    .build();

  const baseDocument = SwaggerModule.createDocument(app, config);

  // Dynamic Swagger JSON endpoint - uses current domain
  app.getHttpAdapter().get('/api-json', (req: Request, res: Response) => {
    const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
    const host =
      req.get('x-forwarded-host') || req.get('host') || 'localhost:3000';
    const origin = `${protocol}://${host}`;

    const dynamicDocument = {
      ...baseDocument,
      servers: [{ url: origin, description: 'Current server' }]
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(dynamicDocument);
  });

  // Minimal Swagger UI setup
  SwaggerModule.setup('api', app, baseDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      url: '/api-json'
    }
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
  console.log(`Swagger JSON: http://localhost:${port}/api-json`);
  console.log(`production: https://ya.akaikumogo.uz/api`);
}

bootstrap();
