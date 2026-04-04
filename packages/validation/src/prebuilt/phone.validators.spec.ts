import { PhoneValidators } from './phone.validators';

describe('PhoneValidators (prebuilt)', () => {
  describe('withCountryCode', () => {
    it('should validate Ecuadorian phone number', () => {
      const validator = PhoneValidators.withCountryCode('EC');
      const result = validator.validate('0991234567');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toContain('+593');
      }
    });

    it('should validate Colombian phone number', () => {
      const validator = PhoneValidators.withCountryCode('CO');
      const result = validator.validate('3001234567');
      expect(result.success).toBe(true);
    });

    it('should reject too-short phone number', () => {
      const validator = PhoneValidators.withCountryCode('EC');
      const result = validator.validate('12345');
      expect(result.success).toBe(false);
    });

    it('should reject non-string input', () => {
      const validator = PhoneValidators.withCountryCode('EC');
      const result = validator.validate(12345);
      expect(result.success).toBe(false);
    });

    it('should throw for unsupported country', () => {
      expect(() => PhoneValidators.withCountryCode('ZZ')).toThrow(
        'Unsupported country',
      );
    });
  });

  describe('general', () => {
    it('should validate general phone number', () => {
      const validator = PhoneValidators.general();
      const result = validator.validate('1234567890');
      expect(result.success).toBe(true);
    });

    it('should reject too-short number', () => {
      const validator = PhoneValidators.general();
      const result = validator.validate('123456');
      expect(result.success).toBe(false);
    });
  });

  describe('getSupportedCountries', () => {
    it('should return supported countries', () => {
      const countries = PhoneValidators.getSupportedCountries();
      expect(countries).toContain('EC');
      expect(countries).toContain('CO');
      expect(countries).toContain('AR');
    });
  });
});
