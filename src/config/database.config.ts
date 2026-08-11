import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from './snake-naming.strategy';

export interface DatabaseEnv {
  DB_HOST?: string;
  DB_PORT?: string | number;
  DB_USER?: string;
  DB_PASSWORD?: string;
  DB_NAME?: string;
}

export function getDatabaseConfig(env: DatabaseEnv): DataSourceOptions {
  return {
    type: 'postgres',
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    invalidWhereValuesBehavior: { undefined: 'ignore' },
  };
}
