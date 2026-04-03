import { IValidator } from '../../domain/ports/validator.port';
import { ValidationResult } from '../../domain/ports/validation-result';

/**
 * Application service that orchestrates validation using IValidator instances.
 * Framework-agnostic - uses constructor injection.
 */
export class ValidationService {
  /**
   * Validates input against the provided validator.
   * @param validator - The validator to use
   * @param input - The raw input to validate
   * @returns ValidationResult with typed data on success
   */
  validate<T>(validator: IValidator<T>, input: unknown): ValidationResult<T> {
    return validator.validate(input);
  }

  /**
   * Validates input and throws if validation fails.
   * Convenience method for cases where failure should be exceptional.
   * @param validator - The validator to use
   * @param input - The raw input to validate
   * @returns The validated and typed data
   * @throws Error with validation error details
   */
  validateOrThrow<T>(validator: IValidator<T>, input: unknown): T {
    const result = validator.validate(input);
    if (!result.success) {
      const messages = result.errors
        .map((e) => `[${e.code}] ${e.path}: ${e.message}`)
        .join('; ');
      throw new Error(`Validation failed: ${messages}`);
    }
    return result.data;
  }
}
