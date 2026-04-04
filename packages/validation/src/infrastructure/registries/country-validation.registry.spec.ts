import { CountryValidationRegistry } from './country-validation.registry';
import { IIdentificationStrategy } from '../../domain/strategies/identification-strategy.port';
import { ValidationResult } from '../../domain/ports/validation-result';

// Mock strategy for testing
class MockStrategy implements IIdentificationStrategy {
  constructor(
    readonly country: string,
    readonly type: string,
  ) {}

  validate(value: string): ValidationResult<string> {
    return ValidationResult.success(value);
  }
}

describe('CountryValidationRegistry', () => {
  let registry: CountryValidationRegistry;

  beforeEach(() => {
    registry = new CountryValidationRegistry();
  });

  describe('register and resolve', () => {
    it('should register and resolve a strategy', () => {
      const strategy = new MockStrategy('EC', 'CEDULA');
      registry.register('EC', 'CEDULA', strategy);
      const resolved = registry.resolve('EC', 'CEDULA');
      expect(resolved).toBe(strategy);
    });

    it('should be case-insensitive', () => {
      const strategy = new MockStrategy('EC', 'CEDULA');
      registry.register('ec', 'cedula', strategy);
      const resolved = registry.resolve('EC', 'CEDULA');
      expect(resolved).toBe(strategy);
    });

    it('should throw when resolving unknown country', () => {
      expect(() => registry.resolve('XX', 'CEDULA')).toThrow(
        'No validation strategies registered for country: XX',
      );
    });

    it('should throw when resolving unknown type', () => {
      registry.register(
        'EC',
        'CEDULA',
        new MockStrategy('EC', 'CEDULA'),
      );
      expect(() => registry.resolve('EC', 'UNKNOWN')).toThrow(
        "No validation strategy registered for type 'UNKNOWN' in country 'EC'",
      );
    });

    it('should allow overwriting existing strategies', () => {
      const first = new MockStrategy('EC', 'CEDULA');
      const second = new MockStrategy('EC', 'CEDULA');
      registry.register('EC', 'CEDULA', first);
      registry.register('EC', 'CEDULA', second);
      expect(registry.resolve('EC', 'CEDULA')).toBe(second);
    });
  });

  describe('getSupportedCountries', () => {
    it('should return empty array when no strategies registered', () => {
      expect(registry.getSupportedCountries()).toEqual([]);
    });

    it('should return all registered countries', () => {
      registry.register('EC', 'CEDULA', new MockStrategy('EC', 'CEDULA'));
      registry.register('CO', 'CEDULA', new MockStrategy('CO', 'CEDULA'));
      const countries = registry.getSupportedCountries();
      expect(countries).toContain('EC');
      expect(countries).toContain('CO');
      expect(countries).toHaveLength(2);
    });
  });

  describe('getSupportedTypes', () => {
    it('should return empty array for unknown country', () => {
      expect(registry.getSupportedTypes('XX')).toEqual([]);
    });

    it('should return all registered types for a country', () => {
      registry.register('EC', 'CEDULA', new MockStrategy('EC', 'CEDULA'));
      registry.register('EC', 'RUC', new MockStrategy('EC', 'RUC'));
      const types = registry.getSupportedTypes('EC');
      expect(types).toContain('CEDULA');
      expect(types).toContain('RUC');
      expect(types).toHaveLength(2);
    });
  });
});
