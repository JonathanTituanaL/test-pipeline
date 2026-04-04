import { CedulaColombiaStrategy } from './cedula-colombia.strategy';

describe('CedulaColombiaStrategy', () => {
  const strategy = new CedulaColombiaStrategy();

  it('should have correct country and type', () => {
    expect(strategy.country).toBe('CO');
    expect(strategy.type).toBe('CEDULA');
  });

  describe('valid cédulas', () => {
    const validCedulas = ['12345678', '1234567890', '123456'];

    it.each(validCedulas)('should validate %s as valid', (cedula) => {
      const result = strategy.validate(cedula);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid cédulas', () => {
    it('should reject strings shorter than 6 digits', () => {
      const result = strategy.validate('12345');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_LENGTH_CEDULA_CO');
      }
    });

    it('should reject strings longer than 10 digits', () => {
      const result = strategy.validate('12345678901');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_LENGTH_CEDULA_CO');
      }
    });

    it('should reject zero value', () => {
      const result = strategy.validate('000000');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_VALUE_CEDULA_CO');
      }
    });
  });

  describe('format', () => {
    it('should strip non-digit characters', () => {
      expect(strategy.format('12.345.678')).toBe('12345678');
    });
  });
});
