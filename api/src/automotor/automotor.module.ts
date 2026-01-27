import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjetoDeValorEntity } from './domain/objeto-de-valor.entity';
import { AutomotorEntity } from './domain/automotor.entity';
import { AutomotorService } from './application/automotor.service';
import { AutomotorController } from './infraestructure/automotor.controller';
import { VwAutomotoresConDueno } from './domain/vw-automotores-con-dueno.entity';
import { VinculoSujetoObjetoEntity } from './domain/vinculo-sujeto-objeto.entity';
import { SujetoModule } from 'src/sujeto/sujeto.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ObjetoDeValorEntity, AutomotorEntity, VwAutomotoresConDueno, VinculoSujetoObjetoEntity]),
        SujetoModule
    ],
    providers: [AutomotorService],
    controllers: [AutomotorController]
})
export class AutomotorModule {}
