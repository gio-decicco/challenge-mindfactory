import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { Repository } from "typeorm";
import { VwAutomotoresConDueno } from "../domain/vw-automotores-con-dueno.entity";
import { AutomotorCreateDto } from "./dto/automotor.create.dto";
import { SujetoService } from "src/sujeto/application/sujeto.service";
import { ObjetoDeValorEntity } from "../domain/objeto-de-valor.entity";
import { AutomotorEntity } from "../domain/automotor.entity";
import { VinculoSujetoObjetoEntity } from "../domain/vinculo-sujeto-objeto.entity";
import { SujetoEntity } from "src/sujeto/domain/sujeto.entity";
import { AutomotorResponseDto } from "./dto/automotor.response.dto";
import { toAutomotorResponseDto } from "./mapper/automotor.dto.mapper";
import { AutomotorUpdateDto } from "./dto/automotor.update.dto";

@Injectable({})
export class AutomotorService{

    constructor(
        @InjectRepository(VwAutomotoresConDueno) 
        private readonly viewRepository: Repository<VwAutomotoresConDueno>,
        @InjectRepository(ObjetoDeValorEntity) 
        private readonly objetoDeValorRepository: Repository<ObjetoDeValorEntity>,
        @InjectRepository(AutomotorEntity) 
        private readonly repository: Repository<AutomotorEntity>,
        @InjectRepository(VinculoSujetoObjetoEntity) 
        private readonly vinculoSORepository: Repository<VinculoSujetoObjetoEntity>,
        private readonly sujetoService: SujetoService
    ) {}

    async findView(){
        return await this.viewRepository.find();
    }

    async findByDominio(dominio: string){
        const automotor = await this.viewRepository.findOne({where: {dominio: dominio }});
        if(!automotor) throw new NotFoundException('Automotor no encontrado');

        return toAutomotorResponseDto(automotor);
    }

    async create(dto: AutomotorCreateDto) {

        let sujeto = await this.obtenerSujeto(dto.cuitDuenio);
        
        let objetoDeValor = await this.obtenerObjetoDeValor(dto.dominio);
        
        let automotor = await this.obtenerAutomotor(dto, objetoDeValor);

        await this.finalizarVinculoSOExistente(objetoDeValor.id);

        await this.crearNuevoVinculoSO(objetoDeValor, sujeto);

        return {
            ...automotor,
            cuitDueno: sujeto.cuit,
            denominacionDueno: sujeto.denominacion
        } as AutomotorResponseDto

    }

    async update(dominio: string, dto: AutomotorUpdateDto){

        //validaciones
        let automotor = await this.repository.findOne({ where: { dominio }, relations: ['objetoDeValor']});
        if(!automotor) throw new UnprocessableEntityException('No existe este vehículo');

        let objetoDeValor = automotor.objetoDeValor;

        let sujeto = await this.sujetoService.findByCuit(dto.cuitDuenio);
        if(!sujeto) throw new UnprocessableEntityException('Este sujeto no existe');

        if(dto.dominio !== dominio){
            let autoExistente = await this.repository.findOne({ where: { dominio: dto.dominio }});
            if(autoExistente) throw new UnprocessableEntityException('El dominio elegido ya existe en otro automóvil');
        }

        //cambio de dueño
        let vinculoDeValorActual = await this.obtenerVinculoDeValorActual(objetoDeValor.id, true);
        if(vinculoDeValorActual!.sujeto.cuit !== dto.cuitDuenio){
            await this.finalizarVinculoSOExistente(objetoDeValor.id);
            await this.crearNuevoVinculoSO(objetoDeValor, sujeto);
        }

        //mapeo de propiedades y retorno
        automotor = this.mapUpdatePropierties(automotor, dto);        
        automotor = await this.repository.save(automotor);

        return {
            ...automotor,
            cuitDueno: sujeto.cuit,
            denominacionDueno: sujeto.denominacion
        } as AutomotorResponseDto
    }

    async delete(dominio: string){

        const automotor = await this.repository.findOne({
            where: { dominio },
            relations: ['objetoDeValor'],
        });

        if (!automotor) {
            throw new NotFoundException('Automotor no encontrado');
        }

        const objetoDeValor = automotor.objetoDeValor;

        await this.vinculoSORepository.delete({
            objetoDeValor: { id: objetoDeValor.id },
        });

        await this.repository.delete({ id: automotor.id });

        await this.objetoDeValorRepository.delete({ id: objetoDeValor.id });
    }


    //#region Private Methods

    private async obtenerSujeto(cuit: string){
        let sujeto = await this.sujetoService.findByCuit(cuit);
        if(!sujeto) throw new UnprocessableEntityException('No existe sujeto con ese CUIT');
        return sujeto;
    }

    private async obtenerObjetoDeValor(codigo: string){
        let ovp = await this.objetoDeValorRepository.findOne({ where: { codigo, tipo: 'AUTOMOTOR' }});
        if(!ovp){
            let ovpToSave = this.objetoDeValorRepository.create({
                tipo: 'AUTOMOTOR',
                codigo,
                descripcion: `Automotor ${codigo}`
            });
            ovp = await this.objetoDeValorRepository.save(ovpToSave);
        }

        return ovp;
    }

    private async obtenerAutomotor(dto: AutomotorCreateDto, objetoDeValor: ObjetoDeValorEntity){
        let automotor = await this.repository.findOne({ where: { dominio: dto.dominio }, relations: ['objetoDeValor']});
        if(!automotor){
            automotor = this.repository.create({
                objetoDeValor,
                dominio: dto.dominio,
                numeroChasis: dto.numeroChasis,
                numeroMotor: dto.numeroMotor,
                color: dto.color,
                fechaFabricacion: dto.fechaFabricacion
            });
        } else {
            automotor.numeroChasis = dto.numeroChasis,
            automotor.numeroMotor = dto.numeroMotor,
            automotor.color = dto.color,
            automotor.fechaFabricacion = dto.fechaFabricacion
        }
        return await this.repository.save(automotor);
    }

    private async finalizarVinculoSOExistente(objetoDeValorId: string){
        let vinculoSO = await this.obtenerVinculoDeValorActual(objetoDeValorId);

        if(vinculoSO){
            await this.vinculoSORepository.save({
                ...vinculoSO,
                fechaFin: new Date()
            });
        }
    }

    private async obtenerVinculoDeValorActual(objetoDeValorId, conSujeto = false){
        return await this.vinculoSORepository.findOne(
            { where: { objetoDeValor: { id: objetoDeValorId }, 
                       fechaFin: undefined,
                       responsable: 'S'
                     }, relations: conSujeto ? ['sujeto'] : undefined
            });
    }

    private async crearNuevoVinculoSO(objetoDeValor: ObjetoDeValorEntity, sujeto: SujetoEntity){
        const nuevoVso = this.vinculoSORepository.create({
            objetoDeValor,
            sujeto: sujeto,
            tipoVinculo: 'DUENO',
            porcentaje: 100,
            responsable: 'S',
            fechaInicio: new Date(),
          });
          await this.vinculoSORepository.save(nuevoVso);
    }

    private mapUpdatePropierties(automotor: AutomotorEntity, dto: AutomotorUpdateDto){

        automotor.color = dto.color,
        automotor.dominio = dto.dominio,
        automotor.fechaFabricacion = dto.fechaFabricacion,
        automotor.numeroChasis = dto.numeroChasis,
        automotor.numeroMotor = dto.numeroMotor
        
        return automotor;
    }

    //#endregion

}