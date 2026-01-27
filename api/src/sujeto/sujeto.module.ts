import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SujetoEntity } from './domain/sujeto.entity';
import { SujetoService } from './application/sujeto.service';
import { SujetoController } from './infraestructure/sujeto.controller';
import { VinculoSujetoObjetoEntity } from './domain/vinculo-sujeto-objeto.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([SujetoEntity, VinculoSujetoObjetoEntity])
    ],
    providers: [SujetoService],
    controllers: [SujetoController]
})
export class SujetoModule {}
