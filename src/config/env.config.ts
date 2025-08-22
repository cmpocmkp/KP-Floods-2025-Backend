import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  env: process.env.NODE_ENV || 'development',
  db: {
    connectionUrl: process.env.DATABASE_URL,
  },
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    allowedClients: (process.env.ALLOWED_CLIENTS || '').split(','),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
}));