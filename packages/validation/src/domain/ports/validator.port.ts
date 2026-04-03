import { ValidationResult } from './validation-result';

/**
 * Generic validator port.
 * All validators in the system implement this interface.
 * Framework-agnostic - pure TypeScript.
 *
 * @template T - The type that the validator produces on success
 */
export interface IValidator<T> {
  /**
   * Validates the given input and returns a typed result.
   * @param input - The raw input to validate (usually unknown)
   * @returns A ValidationResult with typed data on success, or errors on failure
   */
  validate(input: unknown): ValidationResult<T>;
}
