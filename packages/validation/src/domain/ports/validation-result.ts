/**
 * Represents a single validation error.
 * Framework-agnostic - pure TypeScript.
 */
export interface ValidationError {
  /** The field path that caused the error (e.g. 'email', 'address.street') */
  readonly path: string;
  /** A human-readable error message */
  readonly message: string;
  /** A machine-readable error code (e.g. 'INVALID_CEDULA_EC', 'REQUIRED_FIELD') */
  readonly code: string;
}

/**
 * Discriminated union representing the result of a validation operation.
 * Success returns the validated and typed data.
 * Failure returns an array of validation errors.
 */
export type ValidationResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly errors: ValidationError[] };

/**
 * Factory helpers for creating ValidationResult instances.
 */
export const ValidationResult = {
  success<T>(data: T): ValidationResult<T> {
    return { success: true, data };
  },

  failure<T = never>(errors: ValidationError[]): ValidationResult<T> {
    return { success: false, errors };
  },

  singleError<T = never>(
    path: string,
    message: string,
    code: string,
  ): ValidationResult<T> {
    return { success: false, errors: [{ path, message, code }] };
  },
};
