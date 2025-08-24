import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { FloodsModule } from './floods/floods.module';
import { databaseConfig } from './config/database.config';
import { DmisModule } from './dmis/dmis.module';
import { FloodsMapModule } from './floods-map/floods-map.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => ({
        openai: {
          apiKey: process.env.OPENAI_API_KEY,
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
    DmisModule,
    FloodsMapModule,
    ApiModule,
  ],
})
export class AppModule { }
