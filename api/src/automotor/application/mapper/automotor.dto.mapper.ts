import { VwAutomotoresConDueno } from "src/automotor/domain/vw-automotores-con-dueno.entity";
import { AutomotorResponseDto } from "../dto/automotor.response.dto";

export function toAutomotorResponseDto(
  view: VwAutomotoresConDueno,
): AutomotorResponseDto {

  return {
    dominio: view.dominio,
    color: view.color,
    fechaFabricacion: view.fechaFabricacion,
    cuitDueno: view.cuitDueno,
    denominacionDueno: view.denominacionDueno,
    numeroMotor: view.numeroMotor,
    numeroChasis: view.numeroChasis
  };
}