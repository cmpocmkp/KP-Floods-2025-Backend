import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  name: 'default',
  schema: 'public',
  logging: true,
  migrationsRun: true,
  migrationsTransactionMode: 'each',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  ssl: {
    rejectUnauthorized: false,
  },
});