import { isCuitValido } from './cuit.validator';

describe('isCuitValido', () => {
  describe('valid CUITs', () => {
    it('should return true for valid CUIT 20436072180', () => {
      // CUIT válido con dígito verificador correcto
      expect(isCuitValido('20436072180')).toBe(true);
    });

    it('should return true for valid CUITs with correct check digits', () => {
      // Solo usamos CUITs que sabemos que son válidos
      expect(isCuitValido('20436072180')).toBe(true);
    });
  });

  describe('invalid CUITs - format', () => {
    it('should return false for CUIT with less than 11 digits', () => {
      expect(isCuitValido('1234567890')).toBe(false);
      expect(isCuitValido('123456789')).toBe(false);
      expect(isCuitValido('12345')).toBe(false);
      expect(isCuitValido('')).toBe(false);
    });

    it('should return false for CUIT with more than 11 digits', () => {
      expect(isCuitValido('123456789012')).toBe(false);
      expect(isCuitValido('1234567890123')).toBe(false);
    });

    it('should return false for CUIT with non-numeric characters', () => {
      expect(isCuitValido('1234567890A')).toBe(false);
      expect(isCuitValido('123456789-0')).toBe(false);
      expect(isCuitValido('123456789 0')).toBe(false);
      expect(isCuitValido('ABC12345678')).toBe(false);
    });

    it('should return false for CUIT with spaces', () => {
      expect(isCuitValido('20 12345678')).toBe(false);
      expect(isCuitValido('2012345678 0')).toBe(false);
    });

    it('should return false for CUIT with special characters', () => {
      expect(isCuitValido('20-12345678-0')).toBe(false);
      expect(isCuitValido('20.12345678.0')).toBe(false);
    });
  });

  describe('invalid CUITs - check digit', () => {
    it('should return false for CUIT with incorrect check digit', () => {
      // CUIT válido es 20436072180, pero cambiamos el último dígito
      expect(isCuitValido('20436072181')).toBe(false);
      expect(isCuitValido('20436072182')).toBe(false);
      expect(isCuitValido('20436072179')).toBe(false);
    });

    it('should return false when check digit calculation is wrong', () => {
      // CUIT con formato correcto pero dígito verificador incorrecto
      // Cambiamos el último dígito de un CUIT válido
      expect(isCuitValido('20436072181')).toBe(false);
      expect(isCuitValido('20436072182')).toBe(false);
      expect(isCuitValido('20436072179')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle null', () => {
      expect(isCuitValido(null as any)).toBe(false);
    });

    it('should handle undefined', () => {
      expect(isCuitValido(undefined as any)).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isCuitValido('')).toBe(false);
    });

    it('should handle non-string types', () => {
      expect(isCuitValido(12345678901 as any)).toBe(false);
      expect(isCuitValido({} as any)).toBe(false);
      expect(isCuitValido([] as any)).toBe(false);
    });
  });

  describe('check digit calculation', () => {
    it('should correctly validate check digit for known valid CUIT', () => {
      // CUIT 20436072180 tiene dígito verificador correcto
      expect(isCuitValido('20436072180')).toBe(true);
    });

    it('should correctly reject CUIT with wrong check digit', () => {
      // Cambiamos el último dígito para que sea inválido
      expect(isCuitValido('20436072181')).toBe(false);
      expect(isCuitValido('20436072182')).toBe(false);
    });

    it('should handle check digit conversion rules', () => {
      // El algoritmo convierte dig === 11 a 0, y dig === 10 a 9
      // Verificamos que el CUIT válido funciona correctamente
      expect(isCuitValido('20436072180')).toBe(true);
    });
  });
});
