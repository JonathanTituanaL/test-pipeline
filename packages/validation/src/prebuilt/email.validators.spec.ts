import { EmailValidators } from './email.validators';

describe('EmailValidators (prebuilt)', () => {
  describe('standard', () => {
    it('should validate a valid email', () => {
      const validator = EmailValidators.standard();
      const result = validator.validate('user@example.com');
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const validator = EmailValidators.standard();
      const result = validator.validate('not-an-email');
      expect(result.success).toBe(false);
    });

    it('should reject non-string', () => {
      const validator = EmailValidators.standard();
      const result = validator.validate(123);
      expect(result.success).toBe(false);
    });
  });

  describe('strict', () => {
    it('should validate a valid email', () => {
      const validator = EmailValidators.strict();
      const result = validator.validate('user@example.com');
      expect(result.success).toBe(true);
    });

    it('should reject plus-addressing', () => {
      const validator = EmailValidators.strict();
      const result = validator.validate('user+tag@example.com');
      expect(result.success).toBe(false);
    });

    it('should reject too-short email', () => {
      const validator = EmailValidators.strict();
      const result = validator.validate('a@b');
      expect(result.success).toBe(false);
    });
  });
});
