import { BadRequestException } from '@nestjs/common';
import { CuitValidatorPipe } from './cuit.validator.pipe';

describe('CuitValidatorPipe', () => {
  let pipe: CuitValidatorPipe;

  beforeEach(() => {
    pipe = new CuitValidatorPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should return value when CUIT is valid', () => {
      const validCuit = '20436072180';
      const result = pipe.transform(validCuit);
      expect(result).toBe(validCuit);
    });

    it('should throw BadRequestException with correct message when CUIT is invalid', () => {
      const invalidCuit = '1234567890';
      expect(() => pipe.transform(invalidCuit)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidCuit)).toThrow(
        'CUIT inválido. Debe tener 11 dígitos y un dígito verificador válido',
      );
    });
  });
});
