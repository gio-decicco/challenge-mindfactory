import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { AutomotorCreateValidatorPipe } from './automotor.create.validator.pipe';
import { AutomotorCreateDto } from 'src/automotor/application/dto/automotor.create.dto';

describe('AutomotorCreateValidatorPipe', () => {
  let pipe: AutomotorCreateValidatorPipe;

  beforeEach(() => {
    pipe = new AutomotorCreateValidatorPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    const validDto: AutomotorCreateDto = {
      dominio: 'ABC123',
      numeroChasis: '9BWZZZ377VT004251',
      numeroMotor: 'MTR-456789',
      color: 'Rojo',
      fechaFabricacion: 202307,
      cuitDuenio: '20436072180',
    };

    it('should return value when all validations pass', () => {
      const result = pipe.transform(validDto);
      expect(result).toEqual(validDto);
    });

    it('should throw BadRequestException when body is null', () => {
      expect(() => pipe.transform(null)).toThrow(BadRequestException);
      expect(() => pipe.transform(null)).toThrow('Body vacío');
    });

    it('should throw BadRequestException when body is undefined', () => {
      expect(() => pipe.transform(undefined)).toThrow(BadRequestException);
      expect(() => pipe.transform(undefined)).toThrow('Body vacío');
    });

    it('should throw BadRequestException when dominio is invalid', () => {
      const invalidDto = { ...validDto, dominio: 'INVALID' };
      expect(() => pipe.transform(invalidDto)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidDto)).toThrow('Dominio inválido');
    });

    it('should throw UnprocessableEntityException when fechaFabricacion is invalid', () => {
      const invalidDto = { ...validDto, fechaFabricacion: 12345 };
      expect(() => pipe.transform(invalidDto)).toThrow(UnprocessableEntityException);
    });

    it('should throw BadRequestException when cuitDuenio is invalid', () => {
      const invalidDto = { ...validDto, cuitDuenio: '1234567890' };
      expect(() => pipe.transform(invalidDto)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidDto)).toThrow('CUIT inválido');
    });
  });
});
