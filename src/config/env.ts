import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 8080,
  databaseUrl: process.env.DATABASE_URL as string,
  nodeEnv: process.env.NODE_ENV || 'development',
};
