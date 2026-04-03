import { CuiArgentinaStrategy } from './cui-argentina.strategy';

describe('CuiArgentinaStrategy', () => {
  const strategy = new CuiArgentinaStrategy();

  it('should have correct country and type', () => {
    expect(strategy.country).toBe('AR');
    expect(strategy.type).toBe('CUI');
  });

  describe('valid CUIs', () => {
    // Well-known valid CUIL/CUIT numbers
    const validCuis = ['20123456786'];

    it('should validate a valid CUIL', () => {
      // Build a valid CUIL: prefix 20, body 12345678, check digit calculated
      // 20-12345678-6 -> check = (5*2+4*0+3*1+2*2+7*3+6*4+5*5+4*6+3*7+2*8) % 11
      // = (10+0+3+4+21+24+25+24+21+16) = 148, 148 % 11 = 5, 11-5 = 6
      const result = strategy.validate('20123456786');
      expect(result.success).toBe(true);
    });
  });

  describe('invalid CUIs', () => {
    it('should reject non-11-digit strings', () => {
      const result = strategy.validate('12345');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_LENGTH_CUI_AR');
      }
    });

    it('should reject invalid prefix', () => {
      const result = strategy.validate('10123456786');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_PREFIX_CUI_AR');
      }
    });

    it('should reject invalid check digit', () => {
      const result = strategy.validate('20123456787');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_CHECK_DIGIT_CUI_AR');
      }
    });
  });

  describe('format', () => {
    it('should format as XX-XXXXXXXX-X', () => {
      expect(strategy.format('20123456786')).toBe('20-12345678-6');
    });
  });
});
