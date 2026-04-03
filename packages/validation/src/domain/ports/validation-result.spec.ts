import { ValidationResult } from './validation-result';

describe('ValidationResult', () => {
  describe('success', () => {
    it('should create a success result with data', () => {
      const result = ValidationResult.success('hello');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('hello');
      }
    });

    it('should create a success result with complex data', () => {
      const data = { name: 'John', age: 30 };
      const result = ValidationResult.success(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });
  });

  describe('failure', () => {
    it('should create a failure result with errors', () => {
      const errors = [
        { path: 'email', message: 'Invalid email', code: 'INVALID_EMAIL' },
      ];
      const result = ValidationResult.failure(errors);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toEqual(errors);
      }
    });

    it('should create a failure with multiple errors', () => {
      const errors = [
        { path: 'name', message: 'Required', code: 'REQUIRED' },
        { path: 'email', message: 'Invalid', code: 'INVALID_EMAIL' },
      ];
      const result = ValidationResult.failure(errors);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(2);
      }
    });
  });

  describe('singleError', () => {
    it('should create a failure with a single error', () => {
      const result = ValidationResult.singleError(
        'field',
        'Something wrong',
        'ERR_CODE',
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe('field');
        expect(result.errors[0].message).toBe('Something wrong');
        expect(result.errors[0].code).toBe('ERR_CODE');
      }
    });
  });
});
