import { ICountryValidationRegistry } from '../../domain/registries/country-registry.port';
import { IIdentificationStrategy } from '../../domain/strategies/identification-strategy.port';

/**
 * Concrete implementation of the Country Validation Registry.
 * Uses a nested Map structure for O(1) strategy resolution.
 *
 * Internal structure: Map<country, Map<type, strategy>>
 *
 * Framework-agnostic - no external dependencies.
 */
export class CountryValidationRegistry implements ICountryValidationRegistry {
  private readonly strategies = new Map<
    string,
    Map<string, IIdentificationStrategy>
  >();

  register(
    country: string,
    type: string,
    strategy: IIdentificationStrategy,
  ): void {
    const normalizedCountry = country.toUpperCase();
    const normalizedType = type.toUpperCase();

    if (!this.strategies.has(normalizedCountry)) {
      this.strategies.set(normalizedCountry, new Map());
    }

    this.strategies.get(normalizedCountry)!.set(normalizedType, strategy);
  }

  resolve(country: string, type: string): IIdentificationStrategy {
    const normalizedCountry = country.toUpperCase();
    const normalizedType = type.toUpperCase();

    const countryStrategies = this.strategies.get(normalizedCountry);
    if (!countryStrategies) {
      throw new Error(
        `No validation strategies registered for country: ${normalizedCountry}. ` +
          `Supported countries: ${this.getSupportedCountries().join(', ') || 'none'}`,
      );
    }

    const strategy = countryStrategies.get(normalizedType);
    if (!strategy) {
      throw new Error(
        `No validation strategy registered for type '${normalizedType}' in country '${normalizedCountry}'. ` +
          `Supported types: ${this.getSupportedTypes(normalizedCountry).join(', ')}`,
      );
    }

    return strategy;
  }

  getSupportedTypes(country: string): string[] {
    const countryStrategies = this.strategies.get(country.toUpperCase());
    if (!countryStrategies) {
      return [];
    }
    return Array.from(countryStrategies.keys());
  }

  getSupportedCountries(): string[] {
    return Array.from(this.strategies.keys());
  }
}
