import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchScheduler } from './scheduler/scheduler.patch';

import {
  AuthorizationHeader,
  AuthorizationHeaderSchema,
} from './app/swagger.constant';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    // Apply scheduler patch before starting the application
    patchScheduler();
    logger.log('Starting application...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    logger.log('Application created, configuring...');

    // Enable CORS with specific configuration
    app.enableCors({
      origin: (origin, callback) => {
        callback(null, true);
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    });

    logger.log('CORS configured');

    const config = new DocumentBuilder()
      .setTitle('Floods 2025 Backend-Service API Platform')
      .setDescription('The Floods 2025 API documentation')
      .addTag('Floods 2025 Backend-service')
      .setVersion('1.0')
      .addBearerAuth(
        AuthorizationHeaderSchema,
        AuthorizationHeader,
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    
    logger.log('Swagger configured');

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Application is running on port ${port}`);
    
    // Log successful startup
    logger.log(`Application startup complete - http://localhost:${port}`);
  } catch (error) {
    logger.error('Error during application startup:', error);
    // Exit with error code to ensure Railway knows the startup failed
    process.exit(1);
  }
}

bootstrap();
