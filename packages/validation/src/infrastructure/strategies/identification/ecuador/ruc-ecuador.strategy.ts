import { IIdentificationStrategy } from '../../../../domain/strategies/identification-strategy.port';
import { ValidationResult } from '../../../../domain/ports/validation-result';

/**
 * Validates Ecuadorian RUC (Registro Único de Contribuyentes).
 * Format: 13 numeric digits.
 * Types:
 *   - Natural person (third digit 0-5): Module 10
 *   - Public entity (third digit 6): Module 11 with public coefficients
 *   - Private entity (third digit 9): Module 11 with private coefficients
 */
export class RucEcuadorStrategy implements IIdentificationStrategy {
  readonly country = 'EC';
  readonly type = 'RUC';

  validate(value: string): ValidationResult<string> {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length !== 13) {
      return ValidationResult.singleError(
        'identification',
        'Ecuadorian RUC must be exactly 13 digits',
        'INVALID_LENGTH_RUC_EC',
      );
    }

    if (!/^\d{13}$/.test(cleaned)) {
      return ValidationResult.singleError(
        'identification',
        'Ecuadorian RUC must contain only digits',
        'INVALID_FORMAT_RUC_EC',
      );
    }

    const provinceCode = parseInt(cleaned.substring(0, 2), 10);
    if (provinceCode < 1 || provinceCode > 24) {
      return ValidationResult.singleError(
        'identification',
        'Invalid province code in Ecuadorian RUC',
        'INVALID_PROVINCE_RUC_EC',
      );
    }

    const establishment = cleaned.substring(10, 13);
    if (establishment === '000') {
      return ValidationResult.singleError(
        'identification',
        'Establishment code (last 3 digits) cannot be 000',
        'INVALID_ESTABLISHMENT_RUC_EC',
      );
    }

    const thirdDigit = parseInt(cleaned[2], 10);

    if (thirdDigit >= 0 && thirdDigit <= 5) {
      return this.validateNaturalPerson(cleaned);
    } else if (thirdDigit === 6) {
      return this.validatePublicEntity(cleaned);
    } else if (thirdDigit === 9) {
      return this.validatePrivateEntity(cleaned);
    }

    return ValidationResult.singleError(
      'identification',
      'Invalid third digit for Ecuadorian RUC',
      'INVALID_THIRD_DIGIT_RUC_EC',
    );
  }

  format(value: string): string {
    return value.replace(/\D/g, '');
  }

  private validateNaturalPerson(ruc: string): ValidationResult<string> {
    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const digits = ruc.split('').map(Number);
    const checkDigit = digits[9];

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let product = digits[i] * coefficients[i];
      if (product >= 10) {
        product -= 9;
      }
      sum += product;
    }

    const computed = sum % 10 === 0 ? 0 : 10 - (sum % 10);
    if (computed !== checkDigit) {
      return ValidationResult.singleError(
        'identification',
        'Invalid check digit for natural person RUC',
        'INVALID_CHECK_DIGIT_RUC_EC',
      );
    }

    return ValidationResult.success(ruc);
  }

  private validatePublicEntity(ruc: string): ValidationResult<string> {
    const coefficients = [3, 2, 7, 6, 5, 4, 3, 2];
    const digits = ruc.split('').map(Number);
    const checkDigit = digits[8];

    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += digits[i] * coefficients[i];
    }

    const remainder = sum % 11;
    const computed = remainder === 0 ? 0 : 11 - remainder;
    if (computed !== checkDigit) {
      return ValidationResult.singleError(
        'identification',
        'Invalid check digit for public entity RUC',
        'INVALID_CHECK_DIGIT_RUC_EC',
      );
    }

    return ValidationResult.success(ruc);
  }

  private validatePrivateEntity(ruc: string): ValidationResult<string> {
    const coefficients = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    const digits = ruc.split('').map(Number);
    const checkDigit = digits[9];

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * coefficients[i];
    }

    const remainder = sum % 11;
    const computed = remainder === 0 ? 0 : 11 - remainder;
    if (computed !== checkDigit) {
      return ValidationResult.singleError(
        'identification',
        'Invalid check digit for private entity RUC',
        'INVALID_CHECK_DIGIT_RUC_EC',
      );
    }

    return ValidationResult.success(ruc);
  }
}
