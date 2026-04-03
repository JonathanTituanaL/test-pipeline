import { z } from 'zod';
import { ICountryValidationRegistry } from '../../../domain/registries/country-registry.port';
import { ZodValidatorAdapter } from './zod-validator.adapter';
import { IValidator } from '../../../domain/ports/validator.port';

/**
 * Helper functions that combine Zod schemas with the identification registry
 * to create validators that leverage country-specific strategies.
 *
 * These refinements bridge the gap between Zod's schema system
 * and the domain's strategy-based validation.
 */

/**
 * Creates a Zod refinement that validates an identification value
 * using the country validation registry.
 *
 * @param registry - The country validation registry
 * @param country - ISO 3166-1 alpha-2 country code
 * @param type - Document type identifier
 * @returns A Zod schema with the identification refinement
 */
export function createIdentificationSchema(
  registry: ICountryValidationRegistry,
  country: string,
  type: string,
): z.ZodType<string> {
  return z.string().check(
    z.refine((value: string) => {
      const strategy = registry.resolve(
        country.toUpperCase(),
        type.toUpperCase(),
      );
      const result = strategy.validate(value);
      return result.success;
    }, `Invalid ${type} for country ${country}`),
  );
}

/**
 * Creates an IValidator that validates identification using the registry.
 *
 * @param registry - The country validation registry
 * @param country - ISO 3166-1 alpha-2 country code
 * @param type - Document type identifier
 * @returns An IValidator<string> instance
 */
export function createIdentificationValidator(
  registry: ICountryValidationRegistry,
  country: string,
  type: string,
): IValidator<string> {
  const schema = createIdentificationSchema(registry, country, type);
  return new ZodValidatorAdapter(schema);
}
