import { AppConfig } from './app-config.type.js';
import type { AuthConfig } from '../modules/identity/index.js';
import { DatabaseConfig } from '../database/config/database-config.type.js';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
};
