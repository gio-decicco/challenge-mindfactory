import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { AutomotorUpdateDto } from "src/automotor/application/dto/automotor.update.dto";
import { isFechaValido } from "../validators/fecha.validator";
import { isCuitValido } from "../validators/cuit.validator";
import { isDominioValido } from "../validators/dominio.validator";

@Injectable()
export class AutomotorUpdateValidatorPipe implements PipeTransform<AutomotorUpdateDto>{
    transform(value: AutomotorUpdateDto) {
        if (!value) throw new BadRequestException('Body vacío');

        if (!isDominioValido(value.dominio)){
            throw new BadRequestException('Dominio inválido');
        }
    
        if (!isFechaValido(value.fechaFabricacion)) {
          throw new BadRequestException('Fecha de fabricación inválida');
        }
    
        if (!isCuitValido(value.cuitDuenio) ) {
          throw new BadRequestException('CUIT inválido');
        }
    
        return value;
      }
}