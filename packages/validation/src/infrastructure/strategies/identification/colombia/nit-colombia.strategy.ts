import { IIdentificationStrategy } from '../../../../domain/strategies/identification-strategy.port';
import { ValidationResult } from '../../../../domain/ports/validation-result';

/**
 * Validates Colombian NIT (Número de Identificación Tributaria).
 * Format: 9 numeric digits + 1 check digit (can be separated by dash).
 * Algorithm: Weighted sum with prime-based coefficients, module 11.
 */
export class NitColombiaStrategy implements IIdentificationStrategy {
  readonly country = 'CO';
  readonly type = 'NIT';

  private static readonly COEFFICIENTS = [
    71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3,
  ];

  validate(value: string): ValidationResult<string> {
    const cleaned = value.replace(/[-.\s]/g, '');

    if (!/^\d+$/.test(cleaned)) {
      return ValidationResult.singleError(
        'identification',
        'Colombian NIT must contain only digits',
        'INVALID_FORMAT_NIT_CO',
      );
    }

    if (cleaned.length < 9 || cleaned.length > 10) {
      return ValidationResult.singleError(
        'identification',
        'Colombian NIT must be 9 digits plus optional check digit (9-10 digits total)',
        'INVALID_LENGTH_NIT_CO',
      );
    }

    if (cleaned.length === 10) {
      if (!this.validateCheckDigit(cleaned)) {
        return ValidationResult.singleError(
          'identification',
          'Invalid check digit in Colombian NIT',
          'INVALID_CHECK_DIGIT_NIT_CO',
        );
      }
    }

    return ValidationResult.success(cleaned);
  }

  format(value: string): string {
    const cleaned = value.replace(/[-.\s]/g, '');
    if (cleaned.length >= 10) {
      return `${cleaned.substring(0, cleaned.length - 1)}-${cleaned[cleaned.length - 1]}`;
    }
    return cleaned;
  }

  private validateCheckDigit(nit: string): boolean {
    const digits = nit.split('').map(Number);
    const checkDigit = digits[digits.length - 1];
    const numberPart = digits.slice(0, -1);

    const coefficients = NitColombiaStrategy.COEFFICIENTS.slice(
      NitColombiaStrategy.COEFFICIENTS.length - numberPart.length,
    );

    let sum = 0;
    for (let i = 0; i < numberPart.length; i++) {
      sum += numberPart[i] * coefficients[i];
    }

    const remainder = sum % 11;
    let computed: number;
    if (remainder > 1) {
      computed = 11 - remainder;
    } else {
      computed = remainder;
    }

    return computed === checkDigit;
  }
}
