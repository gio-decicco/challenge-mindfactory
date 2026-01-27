import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, CreateDateColumn } from "typeorm";
import { ObjetoDeValorEntity } from "./objeto-de-valor.entity";

@Entity({ name: 'Automotores' })
export class AutomotorEntity {

  @PrimaryGeneratedColumn({ name: 'atr_id', type: 'bigint' })
  id: string;

  @OneToOne(() => ObjetoDeValorEntity, { eager: true })
  @JoinColumn({ name: 'atr_ovp_id' })
  objetoDeValor: ObjetoDeValorEntity;

  @Column({ name: 'atr_dominio', length: 8, unique: true })
  dominio: string;

  @Column({ name: 'atr_numero_chasis', length: 25, nullable: true })
  numeroChasis?: string;

  @Column({ name: 'atr_numero_motor', length: 25, nullable: true })
  numeroMotor?: string;

  @Column({ name: 'atr_color', length: 40, nullable: true })
  color?: string;

  @Column({ name: 'atr_fecha_fabricacion', type: 'int' })
  fechaFabricacion: number;

  @CreateDateColumn({
    name: 'atr_fecha_alta_registro',
    type: 'timestamptz',
  })
  fechaAltaRegistro: Date;
}