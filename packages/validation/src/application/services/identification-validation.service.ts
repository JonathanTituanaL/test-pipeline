import { ICountryValidationRegistry } from '../../domain/registries/country-registry.port';
import { ValidationResult } from '../../domain/ports/validation-result';

/**
 * Application service for validating identification documents.
 * Delegates to the country registry to resolve the correct strategy
 * based on country and document type.
 *
 * Framework-agnostic - uses constructor injection.
 */
export class IdentificationValidationService {
  constructor(private readonly registry: ICountryValidationRegistry) {}

  /**
   * Validates an identification document.
   * @param value - The identification value to validate
   * @param country - ISO 3166-1 alpha-2 country code (e.g. 'EC', 'CO', 'AR')
   * @param type - Document type identifier (e.g. 'CEDULA', 'RUC', 'NIT', 'CUI')
   * @returns ValidationResult with the validated string on success
   */
  validate(
    value: string,
    country: string,
    type: string,
  ): ValidationResult<string> {
    const normalizedCountry = country.toUpperCase();
    const normalizedType = type.toUpperCase();

    try {
      const strategy = this.registry.resolve(normalizedCountry, normalizedType);
      return strategy.validate(value);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown validation error';
      return ValidationResult.singleError(
        'identification',
        message,
        'STRATEGY_RESOLUTION_ERROR',
      );
    }
  }

  /**
   * Returns all supported countries.
   */
  getSupportedCountries(): string[] {
    return this.registry.getSupportedCountries();
  }

  /**
   * Returns all supported document types for a given country.
   */
  getSupportedTypes(country: string): string[] {
    return this.registry.getSupportedTypes(country.toUpperCase());
  }
}
