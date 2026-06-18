import type { Dialect } from "sequelize";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

class Config {
  // Server configuration
  public NODE_ENV!: string;
  public PORT!: number;
  // Database configuration
  public DB_TYPE!: Dialect;
  public POSTGRES_HOST!: string;
  public POSTGRES_PORT!: number;
  public POSTGRES_USER!: string;
  public POSTGRES_PASSWORD!: string;
  public POSTGRES_DB!: string;
  // Logging configuration
  public LOG_LEVEL!: string;
  public CONSOLE_LOGGING!: boolean;

  constructor() {
    this.setServerConfig();
    this.setDatabaseConfig();
    this.setLoggingConfig();
  }

  private setServerConfig() {
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.PORT = parseInt(process.env.PORT || '3000', 10);
  }

  private setDatabaseConfig() {
    this.DB_TYPE = 'postgres';
    this.POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
    this.POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || '5432', 10);
    this.POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
    this.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
    this.POSTGRES_DB = process.env.POSTGRES_DB || 'getfitter_node_db';
  }

  private setLoggingConfig() {
    let LOG_LEVEL = process.env.LOG_LEVEL;
    if (!LOG_LEVEL || !['error', 'warn', 'info', 'http', 'verbose', 'debug', 'sill'].includes(LOG_LEVEL)) {
      LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'error' : 'debug';
    }
    this.LOG_LEVEL = LOG_LEVEL;
    this.CONSOLE_LOGGING = process.env.CONSOLE_LOGGING === 'true' || false;
  }
}

export default new Config();
