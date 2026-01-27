import { UnprocessableEntityException } from '@nestjs/common';
import { isFechaValido } from './fecha.validator';

describe('isFechaValido', () => {
  describe('valid dates', () => {
    it('should return true for valid date in the past', () => {
      expect(isFechaValido(202001)).toBe(true);
      expect(isFechaValido(202307)).toBe(true);
      expect(isFechaValido(199912)).toBe(true);
      expect(isFechaValido(190001)).toBe(true);
    });

    it('should return true for valid date as string', () => {
      expect(isFechaValido('202001')).toBe(true);
      expect(isFechaValido('202307')).toBe(true);
      expect(isFechaValido('199912')).toBe(true);
    });

    it('should return true for current month', () => {
      const now = new Date();
      const currentDate = now.getFullYear() * 100 + (now.getMonth() + 1);
      expect(isFechaValido(currentDate)).toBe(true);
      expect(isFechaValido(String(currentDate))).toBe(true);
    });

    it('should return true for valid months', () => {
      expect(isFechaValido(202301)).toBe(true); // Enero
      expect(isFechaValido(202306)).toBe(true); // Junio
      expect(isFechaValido(202312)).toBe(true); // Diciembre
    });

    it('should return true for year 1900', () => {
      expect(isFechaValido(190001)).toBe(true);
      expect(isFechaValido(190012)).toBe(true);
    });
  });

  describe('invalid format', () => {
    it('should throw UnprocessableEntityException for less than 6 digits', () => {
      expect(() => isFechaValido(12345)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido(1234)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido(123)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('12345')).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('12345')).toThrow(
        'Fecha de fabricación inválida (formato YYYYMM)',
      );
    });

    it('should throw UnprocessableEntityException for more than 6 digits', () => {
      expect(() => isFechaValido(2023011)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido(20230112)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('2023011')).toThrow(UnprocessableEntityException);
    });

    it('should throw UnprocessableEntityException for non-numeric characters', () => {
      expect(() => isFechaValido('20230A')).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('2023-01')).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('2023.01')).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('2023 01')).toThrow(UnprocessableEntityException);
    });

    it('should throw UnprocessableEntityException for empty string', () => {
      expect(() => isFechaValido('')).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('')).toThrow(
        'Fecha de fabricación inválida (formato YYYYMM)',
      );
    });
  });

  describe('invalid year', () => {
    it('should throw UnprocessableEntityException for year less than 1900', () => {
      expect(() => isFechaValido(189912)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido(180001)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido(100001)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('189912')).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('189912')).toThrow('Fecha de fabricación inválida');
    });

    it('should accept year 1900', () => {
      expect(isFechaValido(190001)).toBe(true);
      expect(isFechaValido(190012)).toBe(true);
    });
  });

  describe('invalid month', () => {
    it('should throw UnprocessableEntityException for month less than 1', () => {
      expect(() => isFechaValido(202300)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido(202399)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('202300')).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('202300')).toThrow('Fecha de fabricación inválida');
    });

    it('should throw UnprocessableEntityException for month greater than 12', () => {
      expect(() => isFechaValido(202313)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido(202325)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido(202399)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('202313')).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido('202313')).toThrow('Fecha de fabricación inválida');
    });

    it('should accept all valid months (1-12)', () => {
      for (let month = 1; month <= 12; month++) {
        const date = 202300 + month;
        expect(isFechaValido(date)).toBe(true);
      }
    });
  });

  describe('future dates', () => {
    it('should throw UnprocessableEntityException for future year', () => {
      const futureYear = new Date().getFullYear() + 1;
      const futureDate = futureYear * 100 + 1;
      expect(() => isFechaValido(futureDate)).toThrow(UnprocessableEntityException);
      expect(() => isFechaValido(futureDate)).toThrow(
        'La fecha de fabricación no puede ser futura',
      );
      expect(() => isFechaValido(String(futureDate))).toThrow(UnprocessableEntityException);
    });

    it('should throw UnprocessableEntityException for future month in current year', () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const futureMonth = now.getMonth() + 2; // Mes siguiente
      if (futureMonth <= 12) {
        const futureDate = currentYear * 100 + futureMonth;
        expect(() => isFechaValido(futureDate)).toThrow(UnprocessableEntityException);
        expect(() => isFechaValido(futureDate)).toThrow(
          'La fecha de fabricación no puede ser futura',
        );
      }
    });

    it('should accept current month', () => {
      const now = new Date();
      const currentDate = now.getFullYear() * 100 + (now.getMonth() + 1);
      expect(isFechaValido(currentDate)).toBe(true);
    });

    it('should accept past dates', () => {
      const pastDate = 202001;
      expect(isFechaValido(pastDate)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle null', () => {
      expect(() => isFechaValido(null as any)).toThrow();
    });

    it('should handle undefined', () => {
      expect(() => isFechaValido(undefined as any)).toThrow();
    });

    it('should handle boolean values', () => {
      expect(() => isFechaValido(true as any)).toThrow();
      expect(() => isFechaValido(false as any)).toThrow();
    });

    it('should handle object values', () => {
      expect(() => isFechaValido({} as any)).toThrow();
      expect(() => isFechaValido([] as any)).toThrow();
    });

    it('should handle negative numbers', () => {
      expect(() => isFechaValido(-202301)).toThrow(UnprocessableEntityException);
    });

    it('should handle zero', () => {
      expect(() => isFechaValido(0)).toThrow(UnprocessableEntityException);
    });
  });

  describe('type conversion', () => {
    it('should convert number to string correctly', () => {
      expect(isFechaValido(202301)).toBe(true);
      expect(isFechaValido('202301')).toBe(true);
    });

    it('should handle leading zeros in string', () => {
      // Aunque esto no debería pasar en la práctica, el validador debería manejarlo
      expect(() => isFechaValido('0202301')).toThrow(UnprocessableEntityException);
    });
  });
});
