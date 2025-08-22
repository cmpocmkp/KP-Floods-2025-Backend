import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { FloodsModule } from './floods/floods.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => ({
        openai: {
          apiKey: '***REMOVED***'
        }
      })],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    HealthModule,
    AuthModule,
    UsersModule,
    FileUploadModule,
    FloodsModule,
  ],
})
export class AppModule { }
