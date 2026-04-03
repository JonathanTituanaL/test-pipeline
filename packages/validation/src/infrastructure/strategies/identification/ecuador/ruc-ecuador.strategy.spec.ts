import { RucEcuadorStrategy } from './ruc-ecuador.strategy';

describe('RucEcuadorStrategy', () => {
  const strategy = new RucEcuadorStrategy();

  it('should have correct country and type', () => {
    expect(strategy.country).toBe('EC');
    expect(strategy.type).toBe('RUC');
  });

  describe('valid RUCs', () => {
    it('should validate a natural person RUC', () => {
      // Natural person RUC = cédula + 001
      const result = strategy.validate('1710034065001');
      expect(result.success).toBe(true);
    });
  });

  describe('invalid RUCs', () => {
    it('should reject non-13-digit strings', () => {
      const result = strategy.validate('17100340');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_LENGTH_RUC_EC');
      }
    });

    it('should reject invalid province codes', () => {
      const result = strategy.validate('2510034065001');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_PROVINCE_RUC_EC');
      }
    });

    it('should reject establishment code 000', () => {
      const result = strategy.validate('1710034065000');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_ESTABLISHMENT_RUC_EC');
      }
    });

    it('should reject invalid third digit', () => {
      const result = strategy.validate('0177034065001');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_THIRD_DIGIT_RUC_EC');
      }
    });
  });

  describe('format', () => {
    it('should strip non-digit characters', () => {
      expect(strategy.format('17-10034065-001')).toBe('1710034065001');
    });
  });
});
