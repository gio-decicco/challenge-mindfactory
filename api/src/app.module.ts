import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomotorModule } from './automotor/automotor.module';
import { SujetoModule } from './sujeto/sujeto.module';
import { DatabaseInitService } from './database/database-init.service';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      migrations: ['dist/database/migrations/*.js'],
      migrationsRun: false, // Se ejecutarán manualmente o desde el servicio
    }),
    AutomotorModule,
    SujetoModule,
  ],
  providers: [DatabaseInitService],
})
export class AppModule {}
