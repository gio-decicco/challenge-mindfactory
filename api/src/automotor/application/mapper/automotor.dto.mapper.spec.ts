import { toAutomotorResponseDto } from './automotor.dto.mapper';
import { VwAutomotoresConDueno } from 'src/automotor/domain/vw-automotores-con-dueno.entity';
import { AutomotorResponseDto } from '../dto/automotor.response.dto';

describe('toAutomotorResponseDto', () => {
  it('should map all fields correctly from VwAutomotoresConDueno to AutomotorResponseDto', () => {
    const view: VwAutomotoresConDueno = {
      dominio: 'ABC123',
      numeroChasis: '9BWZZZ377VT004251',
      numeroMotor: 'MTR-456789',
      color: 'Rojo',
      fechaFabricacion: 202307,
      cuitDueno: '20436072180',
      denominacionDueno: 'Juan Pérez SRL',
    };

    const result = toAutomotorResponseDto(view);

    expect(result).toEqual({
      dominio: 'ABC123',
      numeroChasis: '9BWZZZ377VT004251',
      numeroMotor: 'MTR-456789',
      color: 'Rojo',
      fechaFabricacion: 202307,
      cuitDueno: '20436072180',
      denominacionDueno: 'Juan Pérez SRL',
    });
  });

  it('should map optional fields correctly when they are null', () => {
    const view: VwAutomotoresConDueno = {
      dominio: 'XYZ789',
      numeroChasis: null as any,
      numeroMotor: null as any,
      color: null as any,
      fechaFabricacion: 202001,
      cuitDueno: '20436072180',
      denominacionDueno: 'María González SA',
    };

    const result = toAutomotorResponseDto(view);

    expect(result.dominio).toBe('XYZ789');
    expect(result.numeroChasis).toBeNull();
    expect(result.numeroMotor).toBeNull();
    expect(result.color).toBeNull();
    expect(result.fechaFabricacion).toBe(202001);
    expect(result.cuitDueno).toBe('20436072180');
    expect(result.denominacionDueno).toBe('María González SA');
  });

  it('should map all fields with different values', () => {
    const view: VwAutomotoresConDueno = {
      dominio: 'AB123CD',
      numeroChasis: 'CHASSIS123',
      numeroMotor: 'MOTOR456',
      color: 'Azul',
      fechaFabricacion: 202512,
      cuitDueno: '27123456789',
      denominacionDueno: 'Empresa Test S.A.',
    };

    const result = toAutomotorResponseDto(view);

    expect(result.dominio).toBe('AB123CD');
    expect(result.numeroChasis).toBe('CHASSIS123');
    expect(result.numeroMotor).toBe('MOTOR456');
    expect(result.color).toBe('Azul');
    expect(result.fechaFabricacion).toBe(202512);
    expect(result.cuitDueno).toBe('27123456789');
    expect(result.denominacionDueno).toBe('Empresa Test S.A.');
  });

  it('should return AutomotorResponseDto type', () => {
    const view: VwAutomotoresConDueno = {
      dominio: 'ABC123',
      numeroChasis: '9BWZZZ377VT004251',
      numeroMotor: 'MTR-456789',
      color: 'Rojo',
      fechaFabricacion: 202307,
      cuitDueno: '20436072180',
      denominacionDueno: 'Juan Pérez SRL',
    };

    const result = toAutomotorResponseDto(view);

    expect(result).toHaveProperty('dominio');
    expect(result).toHaveProperty('numeroChasis');
    expect(result).toHaveProperty('numeroMotor');
    expect(result).toHaveProperty('color');
    expect(result).toHaveProperty('fechaFabricacion');
    expect(result).toHaveProperty('cuitDueno');
    expect(result).toHaveProperty('denominacionDueno');
  });
});
