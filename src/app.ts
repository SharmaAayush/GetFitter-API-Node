import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

import config from '@/config/env';
import healthRoutes from '@/routes/health.routes';
import apiRoutes from '@/api';
import { errorHandler } from '@/middleware/errorHandler';
import sequelize from '@/config/database';
import logger from '@/services/logger';
import { loadAndInitializeModels } from '@/models';
import { blockJsonFiles } from '@/middleware/assetMiddleware';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.configureModels();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
    this.configureDatabase();
  }

  private configureModels(): void {
    loadAndInitializeModels();
  }

  private configureMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS middleware
    this.app.use(cors());

    // Logging middleware
    this.app.use(morgan('dev'));

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // static assets
    this.app.use(express.static(path.join(__dirname, '..', 'public')));
    const targetFolder = path.join(__dirname, '..', 'submodules', 'free-exercise-db', 'exercises');
    this.app.use('/assets', blockJsonFiles, express.static(targetFolder))
  }

  private configureRoutes(): void {
    // Health check route
    this.app.use('/health', healthRoutes);
    // Register API handler
    this.app.use('/api', apiRoutes);
  }

  private configureErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private async configureDatabase(): Promise<void> {
    try {
      await sequelize.authenticate();
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  }

  public start(): void {
    this.app.listen(config.PORT, () => {
      logger.info('Server is running on port ' + config.PORT);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`Database type: ${config.DB_TYPE}`);
    });
  }

}

const app = new App();
export default app;