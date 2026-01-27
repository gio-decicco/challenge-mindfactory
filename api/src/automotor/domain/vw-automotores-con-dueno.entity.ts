import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'vw_automotores_con_dueno',
})
export class VwAutomotoresConDueno {

  @ViewColumn()
  dominio: string;

  @ViewColumn()
  numero_chasis: string;

  @ViewColumn()
  numero_motor: string;

  @ViewColumn()
  color: string;

  @ViewColumn()
  fecha_fabricacion: number;

  @ViewColumn()
  cuit_dueno: string;

  @ViewColumn()
  denominacion_dueno: string;
}
