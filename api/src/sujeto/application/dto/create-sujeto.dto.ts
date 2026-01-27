import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { isCuitValido } from "src/shared/validators/cuit.validator";

export class CreateSujetoDto{
    @ApiProperty({ example: '20436072180', description: 'CUIT del sujeto' })
    @IsNotEmpty()
    @IsString()
    @Length(11, 11, {message: 'CUIT debe tener 11 dígitos'})
    cuit: string;

    @ApiProperty({ example: 'Giovanni Decicco Ominetti', description: 'Denominación del sujeto' })
    @IsNotEmpty()
    @IsString()
    denominacion: string;

    constructor(cuit: string, denominacion: string){
        if(!isCuitValido(cuit)) throw new Error('CUIT inválido');
        this.cuit = cuit;
        this.denominacion = denominacion;
    }
}