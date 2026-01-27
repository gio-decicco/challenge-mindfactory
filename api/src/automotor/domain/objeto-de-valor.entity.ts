import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'Objeto_De_Valor' })
export class ObjetoDeValorEntity {

  @PrimaryGeneratedColumn({ name: 'ovp_id', type: 'bigint' })
  id: string;

  @Column({ name: 'ovp_tipo', length: 30 })
  tipo: string;

  @Column({ name: 'ovp_codigo', length: 64, unique: true })
  codigo: string;

  @Column({ name: 'ovp_descripcion', length: 240, nullable: true })
  descripcion?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}