import { config as dotenvConfig } from 'dotenv';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database.config';

dotenvConfig({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

export default new DataSource({
  ...getDatabaseConfig(process.env),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
});
