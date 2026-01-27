import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { AutomotorService } from "../application/automotor.service";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { DominioValidatorPipe } from "src/shared/pipes/dominio.validator.pipe";
import { AutomotorCreateValidatorPipe } from "src/shared/pipes/automotor.create.validator.pipe";
import { AutomotorCreateDto } from "../application/dto/automotor.create.dto";
import { AutomotorUpdateValidatorPipe } from "src/shared/pipes/automotor.update.validator.pipe";
import { AutomotorUpdateDto } from "../application/dto/automotor.update.dto";

@Controller('automotores')
export class AutomotorController{

    constructor(private readonly service: AutomotorService){}

    @Get()
    @ApiOperation({ summary: 'Obtiene una lista de automotores' })
    findAll(){
        return this.service.findView();
    }

    @Get(':dominio')
    @ApiParam({name: 'dominio', type: 'string'})
    @ApiOperation({ summary: 'Obtiene un automotor por dominio' })
    @ApiResponse({ status: 200 })
    async findByDominio(@Param('dominio', DominioValidatorPipe) dominio: string){
        return await this.service.findByDominio(dominio);
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo automotor' })
    @ApiResponse({ status: 201, description: 'Automotor creado' })
    async create(@Body(new AutomotorCreateValidatorPipe()) dto: AutomotorCreateDto){
        return await this.service.create(dto);
    }

    @Put(':dominio')
    @HttpCode(HttpStatus.CREATED)
    @ApiParam({name: 'dominio', type: 'string'})
    @ApiOperation({ summary: 'Modifica un automotor existente' })
    @ApiResponse({ status: 201, description: 'Automotor modificado' })
    async update(
        @Param('dominio', DominioValidatorPipe) dominio: string,
        @Body(new AutomotorUpdateValidatorPipe()) dto: AutomotorUpdateDto
    ){
        return await this.service.update(dominio, dto);
    }

    @Delete(':dominio')
    @ApiParam({ name: 'dominio', type: 'string' })
    @ApiOperation({ summary: 'Elimina un automotor por dominio' })
    @ApiResponse({ status: 204 })
    @HttpCode(204)
    async delete(
        @Param('dominio', DominioValidatorPipe) dominio: string
    ) {
        await this.service.delete(dominio);
    }

}