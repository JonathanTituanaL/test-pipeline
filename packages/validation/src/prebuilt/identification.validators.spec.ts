import { IdentificationValidators } from './identification.validators';

describe('IdentificationValidators (prebuilt)', () => {
  describe('ecuador', () => {
    it('should validate a valid Ecuadorian cédula', () => {
      const validator = IdentificationValidators.ecuador.cedula();
      const result = validator.validate('1710034065');
      expect(result.success).toBe(true);
    });

    it('should reject an invalid Ecuadorian cédula', () => {
      const validator = IdentificationValidators.ecuador.cedula();
      const result = validator.validate('0000000000');
      expect(result.success).toBe(false);
    });

    it('should validate a valid Ecuadorian RUC', () => {
      const validator = IdentificationValidators.ecuador.ruc();
      const result = validator.validate('1710034065001');
      expect(result.success).toBe(true);
    });
  });

  describe('colombia', () => {
    it('should validate a valid Colombian cédula', () => {
      const validator = IdentificationValidators.colombia.cedula();
      const result = validator.validate('12345678');
      expect(result.success).toBe(true);
    });

    it('should validate a valid Colombian NIT', () => {
      const validator = IdentificationValidators.colombia.nit();
      const result = validator.validate('123456789');
      expect(result.success).toBe(true);
    });
  });

  describe('argentina', () => {
    it('should validate a valid Argentine CUI', () => {
      const validator = IdentificationValidators.argentina.cui();
      const result = validator.validate('20123456786');
      expect(result.success).toBe(true);
    });
  });

  describe('forCountry', () => {
    it('should resolve dynamically by country and type', () => {
      const validator = IdentificationValidators.forCountry('EC', 'CEDULA');
      const result = validator.validate('1710034065');
      expect(result.success).toBe(true);
    });

    it('should be case-insensitive', () => {
      const validator = IdentificationValidators.forCountry('ec', 'cedula');
      const result = validator.validate('1710034065');
      expect(result.success).toBe(true);
    });

    it('should reject non-string input', () => {
      const validator = IdentificationValidators.forCountry('EC', 'CEDULA');
      const result = validator.validate(12345);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0].code).toBe('INVALID_TYPE');
      }
    });
  });

  describe('withRegistry', () => {
    it('should use custom registry', () => {
      const registry = IdentificationValidators.getDefaultRegistry();
      const validator = IdentificationValidators.withRegistry(
        registry,
        'EC',
        'CEDULA',
      );
      const result = validator.validate('1710034065');
      expect(result.success).toBe(true);
    });
  });
});
