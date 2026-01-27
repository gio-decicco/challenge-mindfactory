import { isDominioValido } from './dominio.validator';

describe('isDominioValido', () => {
  describe('valid dominios', () => {
    it('should return true for format ABC123', () => {
      expect(isDominioValido('ABC123')).toBe(true);
    });

    it('should return true for format AB123CD', () => {
      expect(isDominioValido('AB123CD')).toBe(true);
    });

    it('should return true for lowercase dominio (format ABC123)', () => {
      expect(isDominioValido('abc123')).toBe(true);
    });

    it('should return true for lowercase dominio (format AB123CD)', () => {
      expect(isDominioValido('ab123cd')).toBe(true);
    });

    it('should return true for mixed case dominio', () => {
      expect(isDominioValido('AbC123')).toBe(true);
      expect(isDominioValido('Ab123Cd')).toBe(true);
    });

    it('should return true for various valid examples', () => {
      expect(isDominioValido('XYZ789')).toBe(true);
      expect(isDominioValido('AA111BB')).toBe(true);
      expect(isDominioValido('ZZZ999')).toBe(true);
      expect(isDominioValido('AB000CD')).toBe(true);
    });
  });

  describe('invalid dominios', () => {
    it('should return false for dominio with less than 6 characters', () => {
      expect(isDominioValido('ABC12')).toBe(false);
      expect(isDominioValido('AB12')).toBe(false);
      expect(isDominioValido('ABC')).toBe(false);
    });

    it('should return false for dominio with more than 7 characters', () => {
      expect(isDominioValido('ABC1234')).toBe(false);
      expect(isDominioValido('AB123CDE')).toBe(false);
      expect(isDominioValido('ABCD1234')).toBe(false);
    });

    it('should return false for dominio with wrong pattern (format ABC123)', () => {
      expect(isDominioValido('A1B2C3')).toBe(false);
      expect(isDominioValido('1ABC23')).toBe(false);
      expect(isDominioValido('ABC12D')).toBe(false);
    });

    it('should return false for dominio with wrong pattern (format AB123CD)', () => {
      expect(isDominioValido('A123BCD')).toBe(false);
      expect(isDominioValido('AB12CD')).toBe(false);
      expect(isDominioValido('AB1234CD')).toBe(false);
    });

    it('should return false for dominio with special characters', () => {
      expect(isDominioValido('ABC-123')).toBe(false);
      expect(isDominioValido('ABC@123')).toBe(false);
      expect(isDominioValido('ABC 123')).toBe(false);
      expect(isDominioValido('ABC.123')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isDominioValido('')).toBe(false);
    });

    it('should return false for dominio with numbers in wrong positions', () => {
      expect(isDominioValido('123ABC')).toBe(false);
      expect(isDominioValido('A1BC23')).toBe(false);
    });

    it('should return false for dominio with only letters', () => {
      expect(isDominioValido('ABCDEF')).toBe(false);
      expect(isDominioValido('ABCDEFG')).toBe(false);
    });

    it('should return false for dominio with only numbers', () => {
      expect(isDominioValido('123456')).toBe(false);
      expect(isDominioValido('1234567')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle null by throwing error', () => {
      expect(() => isDominioValido(null as any)).toThrow();
    });

    it('should handle undefined by throwing error', () => {
      expect(() => isDominioValido(undefined as any)).toThrow();
    });

    it('should handle non-string types', () => {
      expect(() => isDominioValido(123 as any)).toThrow();
      expect(() => isDominioValido({} as any)).toThrow();
      expect(() => isDominioValido([] as any)).toThrow();
    });
  });
});
