// pipes/validacion-automotor.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isDominioValido } from '../validators/dominio.validator';
import { isCuitValido } from '../validators/cuit.validator';
import { isFechaValido } from '../validators/fecha.validator';
import { AutomotorCreateDto } from 'src/automotor/application/dto/automotor.create.dto';

@Injectable()
export class AutomotorCreateValidatorPipe implements PipeTransform<AutomotorCreateDto> {
  transform(value: AutomotorCreateDto) {
    if (!value) throw new BadRequestException('Body vacío');

    if (!isDominioValido(value.dominio)) {
      throw new BadRequestException('Dominio inválido');
    }

    if (!isFechaValido(value.fechaFabricacion)) {
      throw new BadRequestException('Fecha de fabricación inválida');
    }

    if (!isCuitValido(value.cuitDuenio)) {
      throw new BadRequestException('CUIT inválido');
    }

    return value;
  }
}
