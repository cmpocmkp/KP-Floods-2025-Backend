import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import {
  AuthorizationHeader,
  AuthorizationHeaderSchema,
} from './app/swagger.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow all origins for development (replace with specific origins in production)
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Allow credentials
  });

  const config = new DocumentBuilder()
    .setTitle('Floods 2025 Backend-Service API Platform')
    .setDescription('The Floods 2025 API documentation')
    .addTag('Floods 2025 Backend-service')
    .setVersion('1.0')
    .addBearerAuth(
      AuthorizationHeaderSchema,
      AuthorizationHeader, // This name here is for matching up with @ApiBearerAuth() in controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Swagger will now be served at /docs

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
