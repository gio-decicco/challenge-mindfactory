// src/sujeto/infraestructure/sujeto.controller.ts
import { Controller, Post, Get, Query, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SujetoService } from '../application/sujeto.service';
import { CreateSujetoDto } from '../application/dto/create-sujeto.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CuitValidatorPipe } from 'src/shared/pipes/cuit.validator.pipe';

@Controller('sujeto')
export class SujetoController {

  constructor(private readonly service: SujetoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo sujeto' })
  @ApiResponse({ status: 201, description: 'Sujeto creado correctamente.' })
  async create(@Body() dto: CreateSujetoDto) {
    try {
      return await this.service.create(dto);
    } catch (err: any) {
      throw new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Get('by-cuit')
  @ApiOperation({ summary: 'Obtener sujeto por CUIT' })
  @ApiResponse({ status: 200, description: 'Devuelve el sujeto encontrado' })
  async getByCuit(@Query('cuit', CuitValidatorPipe) cuit: string) {
    const sujeto = await this.service.findByCuit(cuit);
    if (!sujeto) throw new HttpException('No existe sujeto con ese CUIT', HttpStatus.NOT_FOUND);
    return sujeto;
  }
}
