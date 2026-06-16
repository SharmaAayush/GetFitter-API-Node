import { Sequelize } from 'sequelize';
import config from '@/config/env';

const sequelize = new Sequelize(
  config.POSTGRES_DB || 'getfitter_node_db',
  config.POSTGRES_USER || 'postgres',
  config.POSTGRES_PASSWORD || '',
  {
    host: config.POSTGRES_HOST || 'localhost',
    dialect: config.DB_TYPE,
    port: config.POSTGRES_PORT || 5432,
    logging: config.NODE_ENV === 'development' ? console.log : false,
  }
);

export default sequelize;