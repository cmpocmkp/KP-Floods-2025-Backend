import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const databaseConfig = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: 'postgresql://arsalandb_owner:phNsqJvPu9S6@ep-broad-rain-a5twuu00.us-east-2.aws.neon.tech/arsalandb?sslmode=require',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('DB_SYNC', true), // Set to false in production
    ssl: {
      rejectUnauthorized: false, // Required for Neon SSL connections
    },
  }),
  inject: [ConfigService],
};
