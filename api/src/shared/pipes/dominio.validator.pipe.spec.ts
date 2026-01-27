import { BadRequestException } from '@nestjs/common';
import { DominioValidatorPipe } from './dominio.validator.pipe';

describe('DominioValidatorPipe', () => {
  let pipe: DominioValidatorPipe;

  beforeEach(() => {
    pipe = new DominioValidatorPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should return value when dominio is valid', () => {
      const validDominio = 'ABC123';
      const result = pipe.transform(validDominio);
      expect(result).toBe(validDominio);
    });

    it('should throw BadRequestException with correct message when dominio is invalid', () => {
      const invalidDominio = 'INVALID';
      expect(() => pipe.transform(invalidDominio)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidDominio)).toThrow(
        'Dominio inválido. Debe tener el formato ABC123 o AB123CD',
      );
    });
  });
});
