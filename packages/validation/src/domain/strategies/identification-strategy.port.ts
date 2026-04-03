import { ValidationResult } from '../ports/validation-result';

/**
 * Strategy interface for validating identification documents by country and type.
 * Each implementation encapsulates the validation algorithm for a specific
 * country + document type combination.
 *
 * Framework-agnostic - pure TypeScript.
 */
export interface IIdentificationStrategy {
  /** ISO 3166-1 alpha-2 country code (e.g. 'EC', 'CO', 'AR') */
  readonly country: string;

  /** Document type identifier (e.g. 'CEDULA', 'RUC', 'NIT', 'CUI') */
  readonly type: string;

  /**
   * Validates the given identification value.
   * @param value - The raw identification string to validate
   * @returns A ValidationResult with the validated string on success
   */
  validate(value: string): ValidationResult<string>;

  /**
   * Optionally formats the identification value to its canonical form.
   * @param value - The identification value to format
   * @returns The formatted identification string
   */
  format?(value: string): string;
}
