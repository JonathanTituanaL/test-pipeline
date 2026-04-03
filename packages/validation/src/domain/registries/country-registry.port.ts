import { IIdentificationStrategy } from '../strategies/identification-strategy.port';

/**
 * Registry port for managing identification validation strategies by country and type.
 * Implements the Registry pattern to dynamically resolve the correct strategy
 * at runtime based on country + document type.
 *
 * Framework-agnostic - pure TypeScript.
 */
export interface ICountryValidationRegistry {
  /**
   * Registers a validation strategy for a specific country and document type.
   * @param country - ISO 3166-1 alpha-2 country code
   * @param type - Document type identifier
   * @param strategy - The strategy implementation
   */
  register(
    country: string,
    type: string,
    strategy: IIdentificationStrategy,
  ): void;

  /**
   * Resolves the validation strategy for a given country and document type.
   * @param country - ISO 3166-1 alpha-2 country code
   * @param type - Document type identifier
   * @returns The matching strategy
   * @throws Error if no strategy is registered for the given combination
   */
  resolve(country: string, type: string): IIdentificationStrategy;

  /**
   * Returns all supported document types for a given country.
   * @param country - ISO 3166-1 alpha-2 country code
   * @returns Array of supported document type identifiers
   */
  getSupportedTypes(country: string): string[];

  /**
   * Returns all countries that have registered strategies.
   * @returns Array of ISO 3166-1 alpha-2 country codes
   */
  getSupportedCountries(): string[];
}
