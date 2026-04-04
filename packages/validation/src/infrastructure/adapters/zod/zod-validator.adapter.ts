import { z } from 'zod';
import { IValidator } from '../../../domain/ports/validator.port';
import {
  ValidationResult,
  ValidationError,
} from '../../../domain/ports/validation-result';

/**
 * Adapter that wraps a Zod schema into the IValidator port interface.
 * Translates Zod's safeParse results into the domain's ValidationResult type.
 *
 * This is the only place where Zod types leak — consumers use IValidator<T>.
 *
 * @template T - The type that the Zod schema validates to
 */
export class ZodValidatorAdapter<T> implements IValidator<T> {
  constructor(private readonly schema: z.ZodType<T>) {}

  validate(input: unknown): ValidationResult<T> {
    const result = this.schema.safeParse(input);

    if (result.success) {
      return ValidationResult.success(result.data);
    }

    const errors: ValidationError[] = result.error.issues.map((issue) => ({
      path: issue.path.join('.') || '_root',
      message: issue.message,
      code: issue.code,
    }));

    return ValidationResult.failure(errors);
  }
}
