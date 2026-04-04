import { IValidator } from '../domain/ports/validator.port';
import { ValidationResult } from '../domain/ports/validation-result';

/**
 * Phone number country configurations.
 */
const PHONE_CONFIGS: Record<
  string,
  { countryCode: string; minDigits: number; maxDigits: number }
> = {
  EC: { countryCode: '+593', minDigits: 9, maxDigits: 10 },
  CO: { countryCode: '+57', minDigits: 10, maxDigits: 10 },
  AR: { countryCode: '+54', minDigits: 10, maxDigits: 11 },
  US: { countryCode: '+1', minDigits: 10, maxDigits: 10 },
  MX: { countryCode: '+52', minDigits: 10, maxDigits: 10 },
};

/**
 * Generic phone validator implementation.
 */
class PhoneValidator implements IValidator<string> {
  constructor(
    private readonly minDigits: number,
    private readonly maxDigits: number,
    private readonly countryCode?: string,
  ) {}

  validate(input: unknown): ValidationResult<string> {
    if (typeof input !== 'string') {
      return ValidationResult.singleError(
        'phone',
        'Phone number must be a string',
        'INVALID_TYPE_PHONE',
      );
    }

    const cleaned = input.replace(/[\s\-().+]/g, '');

    if (!/^\d+$/.test(cleaned)) {
      return ValidationResult.singleError(
        'phone',
        'Phone number must contain only digits',
        'INVALID_FORMAT_PHONE',
      );
    }

    if (cleaned.length < this.minDigits || cleaned.length > this.maxDigits) {
      return ValidationResult.singleError(
        'phone',
        `Phone number must be between ${this.minDigits} and ${this.maxDigits} digits`,
        'INVALID_LENGTH_PHONE',
      );
    }

    return ValidationResult.success(
      this.countryCode ? `${this.countryCode}${cleaned}` : cleaned,
    );
  }
}

/**
 * Prebuilt phone validators.
 * Facade pattern - provides ready-to-use phone number validators.
 *
 * @example
 * ```ts
 * import { PhoneValidators } from '@platform/validation';
 *
 * const result = PhoneValidators.withCountryCode('EC').validate('0991234567');
 * ```
 */
export const PhoneValidators = {
  /**
   * Creates a phone validator for a specific country.
   * @param country - ISO 3166-1 alpha-2 country code
   * @returns An IValidator<string> for the given country's phone format
   * @throws Error if the country is not supported
   */
  withCountryCode: (country: string): IValidator<string> => {
    const config = PHONE_CONFIGS[country.toUpperCase()];
    if (!config) {
      throw new Error(
        `Unsupported country for phone validation: ${country}. ` +
          `Supported: ${Object.keys(PHONE_CONFIGS).join(', ')}`,
      );
    }
    return new PhoneValidator(
      config.minDigits,
      config.maxDigits,
      config.countryCode,
    );
  },

  /**
   * General phone validator without country-specific rules.
   * Accepts 7-15 digit phone numbers (E.164 range).
   */
  general: (): IValidator<string> => {
    return new PhoneValidator(7, 15);
  },

  /**
   * Returns supported country codes for phone validation.
   */
  getSupportedCountries: (): string[] => Object.keys(PHONE_CONFIGS),
};
