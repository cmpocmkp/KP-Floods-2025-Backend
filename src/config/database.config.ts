import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const databaseConfig = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: true,
    migrationsRun: true,
    subscribers: [],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    ssl: {
      rejectUnauthorized: false,
    },
    connectTimeoutMS: 30000, // 30 seconds timeout
    extra: {
      connectionTimeoutMillis: 30000,
      query_timeout: 30000,
      statement_timeout: 30000
    },
    retryAttempts: 5,
    retryDelay: 3000,
  }),
  inject: [ConfigService],
};
