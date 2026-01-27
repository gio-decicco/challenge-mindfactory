import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class AutomotorUpdateDto {

    @ApiProperty({ description: 'Dominio del automotor', example: 'AA123BB o AAA123', })
    @IsNotEmpty()
    @IsString()
    dominio: string;

    @ApiPropertyOptional({description: 'Número de chasis', example: '9BWZZZ377VT004251'})
    @IsOptional()
    @IsString()
    numeroChasis?: string;

    @ApiPropertyOptional({ description: 'Número de motor', example: 'MTR-456789'})
    @IsOptional()
    @IsString()
    numeroMotor?: string;

    @ApiPropertyOptional({ description: 'Color del automotor', example: 'Rojo' })
    @IsOptional()
    @IsString()
    color?: string;

    @ApiProperty({ description: 'Fecha de fabricación en formato YYYYMM', example: 202307 })
    @IsNotEmpty()
    @IsNumber()
    fechaFabricacion: number;

    @ApiProperty({ description: 'CUIT del dueño (11 dígitos)', example: '20304050607' })
    @IsNotEmpty()
    @IsString()
    cuitDuenio: string;
}