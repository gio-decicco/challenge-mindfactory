import { Controller, Get, Param } from "@nestjs/common";
import { AutomotorService } from "../application/automotor.service";
import { ApiParam } from "@nestjs/swagger";
import { DominioValidatorPipe } from "src/shared/pipes/dominio.validator.pipe";

@Controller('automotor')
export class AutomotorController{

    constructor(private readonly service: AutomotorService){}

    @Get()
    findAll(){
        return this.service.findView();
    }

    @Get(':dominio')
    @ApiParam({name: 'dominio', type: 'string'})
    findByDominio(@Param('dominio', DominioValidatorPipe) dominio: string){
        return this.service.findByDominio(dominio);
    }


}