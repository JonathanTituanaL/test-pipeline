import { IValidator } from '../domain/ports/validator.port';
import { ValidationResult } from '../domain/ports/validation-result';
import { ICountryValidationRegistry } from '../domain/registries/country-registry.port';
import { CountryValidationRegistry } from '../infrastructure/registries/country-validation.registry';
import { CedulaEcuadorStrategy } from '../infrastructure/strategies/identification/ecuador/cedula-ecuador.strategy';
import { RucEcuadorStrategy } from '../infrastructure/strategies/identification/ecuador/ruc-ecuador.strategy';
import { CedulaColombiaStrategy } from '../infrastructure/strategies/identification/colombia/cedula-colombia.strategy';
import { NitColombiaStrategy } from '../infrastructure/strategies/identification/colombia/nit-colombia.strategy';
import { CuiArgentinaStrategy } from '../infrastructure/strategies/identification/argentina/cui-argentina.strategy';

/**
 * Creates and populates the default country validation registry
 * with all built-in identification strategies.
 */
function createDefaultRegistry(): ICountryValidationRegistry {
  const registry = new CountryValidationRegistry();

  // Ecuador
  const cedulaEc = new CedulaEcuadorStrategy();
  registry.register(cedulaEc.country, cedulaEc.type, cedulaEc);

  const rucEc = new RucEcuadorStrategy();
  registry.register(rucEc.country, rucEc.type, rucEc);

  // Colombia
  const cedulaCo = new CedulaColombiaStrategy();
  registry.register(cedulaCo.country, cedulaCo.type, cedulaCo);

  const nitCo = new NitColombiaStrategy();
  registry.register(nitCo.country, nitCo.type, nitCo);

  // Argentina
  const cuiAr = new CuiArgentinaStrategy();
  registry.register(cuiAr.country, cuiAr.type, cuiAr);

  return registry;
}

/** Singleton default registry instance */
let defaultRegistry: ICountryValidationRegistry | null = null;

function getDefaultRegistry(): ICountryValidationRegistry {
  if (!defaultRegistry) {
    defaultRegistry = createDefaultRegistry();
  }
  return defaultRegistry;
}

/**
 * Wraps a strategy resolve + validate into an IValidator<string>.
 */
class StrategyValidator implements IValidator<string> {
  constructor(
    private readonly registry: ICountryValidationRegistry,
    private readonly country: string,
    private readonly type: string,
  ) {}

  validate(input: unknown): ValidationResult<string> {
    if (typeof input !== 'string') {
      return ValidationResult.singleError(
        'identification',
        'Identification value must be a string',
        'INVALID_TYPE',
      );
    }
    const strategy = this.registry.resolve(this.country, this.type);
    return strategy.validate(input);
  }
}

/**
 * Prebuilt identification validators.
 * Facade pattern - provides ready-to-use validators for common identification types.
 *
 * @example
 * ```ts
 * import { IdentificationValidators } from '@platform/validation';
 *
 * // Static country-specific validators
 * const result = IdentificationValidators.ecuador.cedula().validate('1712345678');
 *
 * // Dynamic resolution
 * const validator = IdentificationValidators.forCountry('EC', 'CEDULA');
 * const result = validator.validate('1712345678');
 * ```
 */
export const IdentificationValidators = {
  /**
   * Ecuador identification validators.
   */
  ecuador: {
    /** Validates Ecuadorian Cédula de Identidad (10 digits, module 10). */
    cedula: (): IValidator<string> =>
      new StrategyValidator(getDefaultRegistry(), 'EC', 'CEDULA'),

    /** Validates Ecuadorian RUC (13 digits, module 10/11 depending on type). */
    ruc: (): IValidator<string> =>
      new StrategyValidator(getDefaultRegistry(), 'EC', 'RUC'),
  },

  /**
   * Colombia identification validators.
   */
  colombia: {
    /** Validates Colombian Cédula de Ciudadanía (6-10 digits). */
    cedula: (): IValidator<string> =>
      new StrategyValidator(getDefaultRegistry(), 'CO', 'CEDULA'),

    /** Validates Colombian NIT with check digit (module 11 with prime coefficients). */
    nit: (): IValidator<string> =>
      new StrategyValidator(getDefaultRegistry(), 'CO', 'NIT'),
  },

  /**
   * Argentina identification validators.
   */
  argentina: {
    /** Validates Argentine CUI/CUIL (11 digits, module 11). */
    cui: (): IValidator<string> =>
      new StrategyValidator(getDefaultRegistry(), 'AR', 'CUI'),
  },

  /**
   * Dynamically resolves a validator for any registered country and type.
   * @param country - ISO 3166-1 alpha-2 country code
   * @param type - Document type identifier
   * @returns An IValidator<string> for the given combination
   */
  forCountry: (country: string, type: string): IValidator<string> =>
    new StrategyValidator(
      getDefaultRegistry(),
      country.toUpperCase(),
      type.toUpperCase(),
    ),

  /**
   * Creates a validator using a custom registry.
   * Useful when consumers have registered additional strategies.
   * @param registry - Custom country validation registry
   * @param country - ISO 3166-1 alpha-2 country code
   * @param type - Document type identifier
   */
  withRegistry: (
    registry: ICountryValidationRegistry,
    country: string,
    type: string,
  ): IValidator<string> =>
    new StrategyValidator(registry, country.toUpperCase(), type.toUpperCase()),

  /**
   * Returns the default registry for advanced use cases.
   */
  getDefaultRegistry,
};
