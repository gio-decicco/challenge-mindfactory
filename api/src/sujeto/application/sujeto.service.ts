import { Injectable } from '@nestjs/common';
import { CreateSujetoDto } from './dto/create-sujeto.dto';
import { SujetoEntity } from '../domain/sujeto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SujetoService {
  constructor(
    @InjectRepository(SujetoEntity)
    private readonly repository: Repository<SujetoEntity>) {}

  async create(dto: CreateSujetoDto){
    const existing = await this.repository.findOne({ where: { cuit: dto.cuit }});
    if (existing) throw new Error('Sujeto con ese CUIT ya existe');

    const sujeto = this.repository.create({
      cuit: dto.cuit,
      denominacion: dto.denominacion,
    });

    return this.repository.save(sujeto);
  }

  async findByCuit(cuit: string){
    return this.repository.findOne({ where: { cuit: cuit }});
  }
}