import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { VwAutomotoresConDueno } from "../domain/vw-automotores-con-dueno.entity";

@Injectable({})
export class AutomotorService{

    constructor(
        @InjectRepository(VwAutomotoresConDueno) 
        private readonly viewRepository: Repository<VwAutomotoresConDueno>
    ) {}

    findView(){
        return this.viewRepository.find();
    }

    findByDominio(dominio: string){
        return this.viewRepository.findOne({where: {dominio: dominio }})
    }

}