export interface AutomotorCreateDto {
    dominio: string;
    numeroChasis?: string;
    numeroMotor?: string;
    color?: string;
    fechaFabricacion: number;
    cuitDuenio: string;
}