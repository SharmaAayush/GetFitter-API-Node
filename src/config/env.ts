import type { Dialect } from "sequelize";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

class Config {
  // Server configuration
  public NODE_ENV: string;
  public PORT: number;
  // Database configuration
  public DB_TYPE: Dialect = 'postgres';
  public POSTGRES_HOST: string | undefined;
  public POSTGRES_PORT: number | undefined;
  public POSTGRES_USER: string | undefined;
  public POSTGRES_PASSWORD: string | undefined;
  public POSTGRES_DB: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.PORT = parseInt(process.env.PORT || '3000', 10);

    this.POSTGRES_HOST = process.env.POSTGRES_HOST;
    this.POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || '5432', 10);
    this.POSTGRES_USER = process.env.POSTGRES_USER;
    this.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
    this.POSTGRES_DB = process.env.POSTGRES_DB;
  }
}

export default new Config();
