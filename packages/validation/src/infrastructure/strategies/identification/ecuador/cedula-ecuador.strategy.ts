import { IIdentificationStrategy } from '../../../../domain/strategies/identification-strategy.port';
import { ValidationResult } from '../../../../domain/ports/validation-result';

/**
 * Validates Ecuadorian Cédula de Identidad.
 * Algorithm: Module 10 with SRI coefficients.
 * Format: 10 numeric digits.
 */
export class CedulaEcuadorStrategy implements IIdentificationStrategy {
  readonly country = 'EC';
  readonly type = 'CEDULA';

  private static readonly COEFFICIENTS = [2, 1, 2, 1, 2, 1, 2, 1, 2];

  validate(value: string): ValidationResult<string> {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length !== 10) {
      return ValidationResult.singleError(
        'identification',
        'Ecuadorian cédula must be exactly 10 digits',
        'INVALID_LENGTH_CEDULA_EC',
      );
    }

    if (!/^\d{10}$/.test(cleaned)) {
      return ValidationResult.singleError(
        'identification',
        'Ecuadorian cédula must contain only digits',
        'INVALID_FORMAT_CEDULA_EC',
      );
    }

    const provinceCode = parseInt(cleaned.substring(0, 2), 10);
    if (provinceCode < 1 || provinceCode > 24) {
      return ValidationResult.singleError(
        'identification',
        'Invalid province code in Ecuadorian cédula',
        'INVALID_PROVINCE_CEDULA_EC',
      );
    }

    const thirdDigit = parseInt(cleaned[2], 10);
    if (thirdDigit >= 6) {
      return ValidationResult.singleError(
        'identification',
        'Invalid third digit for Ecuadorian cédula (must be 0-5)',
        'INVALID_THIRD_DIGIT_CEDULA_EC',
      );
    }

    if (!this.validateCheckDigit(cleaned)) {
      return ValidationResult.singleError(
        'identification',
        'Invalid check digit in Ecuadorian cédula',
        'INVALID_CHECK_DIGIT_CEDULA_EC',
      );
    }

    return ValidationResult.success(cleaned);
  }

  format(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    return cleaned;
  }

  private validateCheckDigit(cedula: string): boolean {
    const digits = cedula.split('').map(Number);
    const checkDigit = digits[9];

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let product = digits[i] * CedulaEcuadorStrategy.COEFFICIENTS[i];
      if (product >= 10) {
        product -= 9;
      }
      sum += product;
    }

    const computedCheck = sum % 10 === 0 ? 0 : 10 - (sum % 10);
    return computedCheck === checkDigit;
  }
}
