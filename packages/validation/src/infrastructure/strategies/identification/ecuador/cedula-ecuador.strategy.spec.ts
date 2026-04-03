import { CedulaEcuadorStrategy } from './cedula-ecuador.strategy';

describe('CedulaEcuadorStrategy', () => {
  const strategy = new CedulaEcuadorStrategy();

  it('should have correct country and type', () => {
    expect(strategy.country).toBe('EC');
    expect(strategy.type).toBe('CEDULA');
  });

  describe('valid cédulas', () => {
    const validCedulas = ['1710034065'];

    it.each(validCedulas)('should validate %s as valid', (cedula) => {
      const result = strategy.validate(cedula);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid cédulas', () => {
    it('should reject non-10-digit strings', () => {
      const result = strategy.validate('12345');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_LENGTH_CEDULA_EC');
      }
    });

    it('should reject invalid province codes', () => {
      const result = strategy.validate('2512345678');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_PROVINCE_CEDULA_EC');
      }
    });

    it('should reject invalid third digit (>=6)', () => {
      const result = strategy.validate('0172345678');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_THIRD_DIGIT_CEDULA_EC');
      }
    });

    it('should reject invalid check digit', () => {
      const result = strategy.validate('1710034066');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_CHECK_DIGIT_CEDULA_EC');
      }
    });

    it('should reject empty string', () => {
      const result = strategy.validate('');
      expect(result.success).toBe(false);
    });
  });

  describe('format', () => {
    it('should strip non-digit characters', () => {
      expect(strategy.format('17-1003-4065')).toBe('1710034065');
    });
  });
});
