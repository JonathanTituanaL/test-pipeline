import { ZodSchemaAdapter } from './zod-schema.adapter';

describe('ZodSchemaAdapter', () => {
  let builder: ZodSchemaAdapter;

  beforeEach(() => {
    builder = new ZodSchemaAdapter();
  });

  describe('string()', () => {
    it('should validate a string', () => {
      const validator = builder.string().toValidator();
      const result = validator.validate('hello');
      expect(result.success).toBe(true);
    });

    it('should reject non-string', () => {
      const validator = builder.string().toValidator();
      const result = validator.validate(123);
      expect(result.success).toBe(false);
    });

    it('should apply min constraint', () => {
      const validator = builder.string().min(3).toValidator();
      expect(validator.validate('ab').success).toBe(false);
      expect(validator.validate('abc').success).toBe(true);
    });

    it('should apply max constraint', () => {
      const validator = builder.string().max(3).toValidator();
      expect(validator.validate('abcd').success).toBe(false);
      expect(validator.validate('abc').success).toBe(true);
    });

    it('should apply email constraint', () => {
      const validator = builder.string().email().toValidator();
      expect(validator.validate('not-email').success).toBe(false);
      expect(validator.validate('user@example.com').success).toBe(true);
    });

    it('should apply regex constraint', () => {
      const validator = builder.string().regex(/^\d+$/).toValidator();
      expect(validator.validate('abc').success).toBe(false);
      expect(validator.validate('123').success).toBe(true);
    });

    it('should apply length constraint', () => {
      const validator = builder.string().length(5).toValidator();
      expect(validator.validate('abcd').success).toBe(false);
      expect(validator.validate('abcde').success).toBe(true);
    });

    it('should support optional', () => {
      const validator = builder.string().optional().toValidator();
      expect(validator.validate(undefined).success).toBe(true);
      expect(validator.validate('hello').success).toBe(true);
    });

    it('should support refine', () => {
      const validator = builder
        .string()
        .refine((v) => v.startsWith('A'))
        .toValidator();
      expect(validator.validate('Abc').success).toBe(true);
      expect(validator.validate('Bcd').success).toBe(false);
    });
  });

  describe('number()', () => {
    it('should validate a number', () => {
      const validator = builder.number().toValidator();
      expect(validator.validate(42).success).toBe(true);
      expect(validator.validate('abc').success).toBe(false);
    });

    it('should apply min constraint', () => {
      const validator = builder.number().min(10).toValidator();
      expect(validator.validate(5).success).toBe(false);
      expect(validator.validate(15).success).toBe(true);
    });

    it('should apply max constraint', () => {
      const validator = builder.number().max(10).toValidator();
      expect(validator.validate(15).success).toBe(false);
      expect(validator.validate(5).success).toBe(true);
    });

    it('should apply int constraint', () => {
      const validator = builder.number().int().toValidator();
      expect(validator.validate(5.5).success).toBe(false);
      expect(validator.validate(5).success).toBe(true);
    });

    it('should apply positive constraint', () => {
      const validator = builder.number().positive().toValidator();
      expect(validator.validate(0).success).toBe(false);
      expect(validator.validate(1).success).toBe(true);
    });
  });

  describe('boolean()', () => {
    it('should validate a boolean', () => {
      const validator = builder.boolean().toValidator();
      expect(validator.validate(true).success).toBe(true);
      expect(validator.validate('true').success).toBe(false);
    });
  });

  describe('object()', () => {
    it('should validate an object shape', () => {
      const validator = builder
        .object({
          name: builder.string().min(1),
          age: builder.number().min(0),
        })
        .toValidator();

      const valid = validator.validate({ name: 'John', age: 30 });
      expect(valid.success).toBe(true);

      const invalid = validator.validate({ name: '', age: -1 });
      expect(invalid.success).toBe(false);
    });
  });

  describe('array()', () => {
    it('should validate an array', () => {
      const validator = builder.array(builder.string()).toValidator();
      expect(validator.validate(['a', 'b']).success).toBe(true);
      expect(validator.validate([1, 2]).success).toBe(false);
    });
  });

  describe('enum()', () => {
    it('should validate enum values', () => {
      const validator = builder.enum(['A', 'B', 'C'] as const).toValidator();
      expect(validator.validate('A').success).toBe(true);
      expect(validator.validate('D').success).toBe(false);
    });
  });
});
