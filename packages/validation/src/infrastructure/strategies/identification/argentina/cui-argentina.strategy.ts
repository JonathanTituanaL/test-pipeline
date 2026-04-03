import { IIdentificationStrategy } from '../../../../domain/strategies/identification-strategy.port';
import { ValidationResult } from '../../../../domain/ports/validation-result';

/**
 * Validates Argentine CUI/CUIL (Código Único de Identificación / Laboral).
 * Format: 11 numeric digits (XX-XXXXXXXX-X).
 * Algorithm: Module 11 with weighted coefficients.
 */
export class CuiArgentinaStrategy implements IIdentificationStrategy {
  readonly country = 'AR';
  readonly type = 'CUI';

  private static readonly COEFFICIENTS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  private static readonly VALID_PREFIXES = [
    '20',
    '23',
    '24',
    '27',
    '30',
    '33',
    '34',
  ];

  validate(value: string): ValidationResult<string> {
    const cleaned = value.replace(/[-.\s]/g, '');

    if (!/^\d{11}$/.test(cleaned)) {
      return ValidationResult.singleError(
        'identification',
        'Argentine CUI/CUIL must be exactly 11 digits',
        'INVALID_LENGTH_CUI_AR',
      );
    }

    const prefix = cleaned.substring(0, 2);
    if (!CuiArgentinaStrategy.VALID_PREFIXES.includes(prefix)) {
      return ValidationResult.singleError(
        'identification',
        `Invalid CUI/CUIL prefix: ${prefix}. Valid prefixes: ${CuiArgentinaStrategy.VALID_PREFIXES.join(', ')}`,
        'INVALID_PREFIX_CUI_AR',
      );
    }

    if (!this.validateCheckDigit(cleaned)) {
      return ValidationResult.singleError(
        'identification',
        'Invalid check digit in Argentine CUI/CUIL',
        'INVALID_CHECK_DIGIT_CUI_AR',
      );
    }

    return ValidationResult.success(cleaned);
  }

  format(value: string): string {
    const cleaned = value.replace(/[-.\s]/g, '');
    if (cleaned.length === 11) {
      return `${cleaned.substring(0, 2)}-${cleaned.substring(2, 10)}-${cleaned[10]}`;
    }
    return cleaned;
  }

  private validateCheckDigit(cui: string): boolean {
    const digits = cui.split('').map(Number);
    const checkDigit = digits[10];

    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * CuiArgentinaStrategy.COEFFICIENTS[i];
    }

    const remainder = sum % 11;
    let computed: number;
    if (remainder === 0) {
      computed = 0;
    } else if (remainder === 1) {
      computed = 9;
    } else {
      computed = 11 - remainder;
    }

    return computed === checkDigit;
  }
}
