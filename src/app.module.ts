import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-broad-rain-a5twuu00.us-east-2.aws.neon.tech',
      port: parseInt('5432', 10),
      username: 'arsalandb_owner',
      password: 'phNsqJvPu9S6',
      database: 'arsalandb',
      autoLoadEntities: true,
      synchronize: true, // Disable in production
      ssl:
        'true' === 'true'
          ? { rejectUnauthorized: false }
          : undefined,
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    FileUploadModule,
  ],
})
export class AppModule { }
