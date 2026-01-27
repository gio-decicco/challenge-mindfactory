import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isCuitValido } from '../validators/cuit.validator';

@Injectable()
export class CuitValidatorPipe implements PipeTransform {
  transform(value: any) {
    if (!isCuitValido(value)) {
      throw new BadRequestException('CUIT inválido. Debe tener 11 dígitos y un dígito verificador válido');
    }
    return value;
  }
}