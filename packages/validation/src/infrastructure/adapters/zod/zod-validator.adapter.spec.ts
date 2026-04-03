import { ZodValidatorAdapter } from './zod-validator.adapter';
import { z } from 'zod';

describe('ZodValidatorAdapter', () => {
  describe('with string schema', () => {
    const validator = new ZodValidatorAdapter(z.string().min(3));

    it('should return success for valid input', () => {
      const result = validator.validate('hello');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('hello');
      }
    });

    it('should return failure for invalid input', () => {
      const result = validator.validate('ab');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('should return failure for wrong type', () => {
      const result = validator.validate(123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('with object schema', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().min(0),
    });
    const validator = new ZodValidatorAdapter(schema);

    it('should return success for valid object', () => {
      const result = validator.validate({ name: 'John', age: 30 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John');
        expect(result.data.age).toBe(30);
      }
    });

    it('should return multiple errors for invalid object', () => {
      const result = validator.validate({ name: 123, age: -1 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });
});
