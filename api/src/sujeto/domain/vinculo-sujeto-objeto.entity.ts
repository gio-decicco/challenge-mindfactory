import { SujetoEntity } from "src/sujeto/domain/sujeto.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from "typeorm";
import { ObjetoDeValorEntity } from "../../automotor/domain/objeto-de-valor.entity";

@Entity({ name: 'Vinculo_Sujeto_Objeto' })
export class VinculoSujetoObjetoEntity {

  @PrimaryGeneratedColumn({ name: 'vso_id', type: 'bigint' })
  id: string;

  @ManyToOne(() => ObjetoDeValorEntity)
  @JoinColumn({ name: 'vso_ovp_id' })
  objetoDeValor: ObjetoDeValorEntity;

  @ManyToOne(() => SujetoEntity)
  @JoinColumn({ name: 'vso_spo_id' })
  sujeto: SujetoEntity;

  @Column({ name: 'vso_tipo_vinculo', length: 30 })
  tipoVinculo: string;

  @Column({ name: 'vso_porcentaje', type: 'numeric', precision: 5, scale: 2 })
  porcentaje: number;

  @Column({ name: 'vso_responsable', length: 1 })
  responsable: string;

  @Column({ name: 'vso_fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'vso_fecha_fin', type: 'date', nullable: true })
  fechaFin?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}