import { IValidator } from '../domain/ports/validator.port';
import { ZodSchemaAdapter } from '../infrastructure/adapters/zod/zod-schema.adapter';

/**
 * Prebuilt email validators.
 * Facade pattern - provides ready-to-use email validators.
 *
 * @example
 * ```ts
 * import { EmailValidators } from '@platform/validation';
 *
 * const result = EmailValidators.standard().validate('user@example.com');
 * ```
 */
export const EmailValidators = {
  /**
   * Standard email validation.
   * Uses Zod's built-in email validation via the schema adapter.
   */
  standard: (): IValidator<string> => {
    const builder = new ZodSchemaAdapter();
    return builder.string().email('Invalid email address').toValidator();
  },

  /**
   * Strict email validation with additional constraints.
   * Disallows plus-addressing and requires minimum length.
   */
  strict: (): IValidator<string> => {
    const builder = new ZodSchemaAdapter();
    return builder
      .string()
      .email('Invalid email address')
      .min(5, 'Email must be at least 5 characters')
      .max(254, 'Email must not exceed 254 characters')
      .refine(
        (val: string) => !val.includes('+'),
        'Plus-addressing is not allowed',
      )
      .toValidator();
  },
};
