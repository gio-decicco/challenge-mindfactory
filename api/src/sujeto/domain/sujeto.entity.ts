import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'Sujeto'})
export class SujetoEntity{

    
  @PrimaryGeneratedColumn({ name: 'spo_id', type: 'bigint' })
  id: string;

  @Column({ name: 'spo_cuit', length: 11, unique: true })
  cuit: string;

  @Column({ name: 'spo_denominacion', length: 160 })
  denominacion: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;
}