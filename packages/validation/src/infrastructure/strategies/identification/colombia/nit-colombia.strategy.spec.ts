import { NitColombiaStrategy } from './nit-colombia.strategy';

describe('NitColombiaStrategy', () => {
  const strategy = new NitColombiaStrategy();

  it('should have correct country and type', () => {
    expect(strategy.country).toBe('CO');
    expect(strategy.type).toBe('NIT');
  });

  describe('valid NITs', () => {
    it('should validate a 9-digit NIT without check digit', () => {
      const result = strategy.validate('123456789');
      expect(result.success).toBe(true);
    });
  });

  describe('invalid NITs', () => {
    it('should reject too-short strings', () => {
      const result = strategy.validate('12345');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_LENGTH_NIT_CO');
      }
    });

    it('should reject too-long strings', () => {
      const result = strategy.validate('12345678901');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_LENGTH_NIT_CO');
      }
    });

    it('should reject non-numeric strings', () => {
      const result = strategy.validate('12345678a');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_FORMAT_NIT_CO');
      }
    });
  });

  describe('format', () => {
    it('should format with dash separator for check digit', () => {
      expect(strategy.format('1234567890')).toBe('123456789-0');
    });

    it('should not format 9-digit NIT', () => {
      expect(strategy.format('123456789')).toBe('123456789');
    });
  });
});
