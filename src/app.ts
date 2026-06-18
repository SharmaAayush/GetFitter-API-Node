import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import config from '@/config/env';
import healthRoutes from '@/routes/health';
import equipmentRoutes from '@/routes/equipmentRoutes';
import { errorHandler } from '@/middleware/errorHandler';
import sequelize from '@/config/database';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
    this.configureDatabase();
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
  }

  private configureRoutes(): void {
    // Health check route
    this.app.use('/health', healthRoutes);
    // Equipment routes
    this.app.use('/equipment', equipmentRoutes);
  }

  private configureErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private async configureDatabase(): Promise<void> {
    try {
      await sequelize.authenticate();
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  }

  public start(): void {
    this.app.listen(config.PORT, () => {
      console.log('Server is running on port ' + config.PORT);
      console.log(`Environment: ${config.NODE_ENV}`);
      console.log(`Database type: ${config.DB_TYPE}`);
    });
  }

}

const app = new App();
export default app;