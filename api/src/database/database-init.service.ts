import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      this.logger.log('Running database migrations...');
      
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      
      await AppDataSource.runMigrations();
      
      this.logger.log('Database migrations completed successfully');
    } catch (error) {
      this.logger.error('Error running migrations:', error.message);
      // No lanzamos el error para que la aplicación pueda iniciar
    }
  }
}
