import { IIdentificationStrategy } from '../../../../domain/strategies/identification-strategy.port';
import { ValidationResult } from '../../../../domain/ports/validation-result';

/**
 * Validates Colombian Cédula de Ciudadanía.
 * Format: 6-10 numeric digits.
 */
export class CedulaColombiaStrategy implements IIdentificationStrategy {
  readonly country = 'CO';
  readonly type = 'CEDULA';

  validate(value: string): ValidationResult<string> {
    const cleaned = value.replace(/\D/g, '');

    if (!/^\d+$/.test(cleaned)) {
      return ValidationResult.singleError(
        'identification',
        'Colombian cédula must contain only digits',
        'INVALID_FORMAT_CEDULA_CO',
      );
    }

    if (cleaned.length < 6 || cleaned.length > 10) {
      return ValidationResult.singleError(
        'identification',
        'Colombian cédula must be between 6 and 10 digits',
        'INVALID_LENGTH_CEDULA_CO',
      );
    }

    const numValue = parseInt(cleaned, 10);
    if (numValue <= 0) {
      return ValidationResult.singleError(
        'identification',
        'Colombian cédula must be a positive number',
        'INVALID_VALUE_CEDULA_CO',
      );
    }

    return ValidationResult.success(cleaned);
  }

  format(value: string): string {
    return value.replace(/\D/g, '');
  }
}
