import Sequelize from 'sequelize';
// @ts-expect-error We need to import with extension to make sequelize-cli work
import config from './env.ts';

type DBConfigItem = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Sequelize.Dialect;
  port: number;
} & (
    {
      seederStorage: "sequelize",
      seederStorageTableName?: string,
    } | {
      seederStorage: "json",
      seederStoragePath?: string,
    }
  )

type DBConfig = Record<string, DBConfigItem>;

const dbConfigItem: DBConfigItem = {
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  host: config.POSTGRES_HOST,
  dialect: config.DB_TYPE,
  port: config.POSTGRES_PORT,
  seederStorage: "sequelize",
};

const dbConfig: DBConfig = {
  [config.NODE_ENV]: dbConfigItem,
  // Keep the same configuration for default environments since we are using environment variables to manage the configuration
  development: dbConfigItem,
  test: dbConfigItem,
  production: dbConfigItem,
};

export default dbConfig;