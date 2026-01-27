import { ApiProperty } from '@nestjs/swagger';

export class AutomotorResponseDto {
  @ApiProperty({ example: 'ABC123', description: 'Dominio del automotor' })
  dominio: string;

  @ApiProperty({ example: '1234567890123456789012345', description: 'Número de chasis' })
  numeroChasis?: string;

  @ApiProperty({ example: '9876543210987654321098765', description: 'Número de motor' })
  numeroMotor?: string;

  @ApiProperty({ example: 'Rojo', description: 'Color del automotor' })
  color?: string;

  @ApiProperty({ example: 202301, description: 'Fecha de fabricación YYYYMM' })
  fechaFabricacion: number;

  @ApiProperty({ example: '20304050607', description: 'CUIT del dueño' })
  cuitDueno?: string;

  @ApiProperty({ example: 'Juan Pérez SRL', description: 'Denominación del dueño' })
  denominacionDueno?: string;
}
