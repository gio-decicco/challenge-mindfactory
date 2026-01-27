import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isDominioValido } from '../validators/dominio.validator';

@Injectable()
export class DominioValidatorPipe implements PipeTransform {
  transform(value: any) {
    if (!isDominioValido(value)) {
      throw new BadRequestException('Dominio inválido. Debe tener el formato ABC123 o AB123CD');
    }
    return value;
  }
}