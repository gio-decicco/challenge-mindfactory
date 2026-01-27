import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'vw_automotores_con_dueno',
})
export class VwAutomotoresConDueno {

  @ViewColumn()
  dominio: string;

  @ViewColumn({ name: 'numero_chasis' })
  numeroChasis: string;

  @ViewColumn({ name: 'numero_motor' })
  numeroMotor: string;

  @ViewColumn()
  color: string;

  @ViewColumn({ name: 'fecha_fabricacion' })
  fechaFabricacion: number;

  @ViewColumn({ name: 'cuit_dueno' })
  cuitDueno: string;

  @ViewColumn({ name: 'denominacion_dueno' })
  denominacionDueno: string;
}
