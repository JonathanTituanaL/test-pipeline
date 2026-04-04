import { IdentificationValidationService } from './identification-validation.service';
import { CountryValidationRegistry } from '../../infrastructure/registries/country-validation.registry';
import { CedulaEcuadorStrategy } from '../../infrastructure/strategies/identification/ecuador/cedula-ecuador.strategy';
import { CuiArgentinaStrategy } from '../../infrastructure/strategies/identification/argentina/cui-argentina.strategy';

describe('IdentificationValidationService', () => {
  let service: IdentificationValidationService;
  let registry: CountryValidationRegistry;

  beforeEach(() => {
    registry = new CountryValidationRegistry();
    const cedEc = new CedulaEcuadorStrategy();
    registry.register(cedEc.country, cedEc.type, cedEc);
    const cuiAr = new CuiArgentinaStrategy();
    registry.register(cuiAr.country, cuiAr.type, cuiAr);
    service = new IdentificationValidationService(registry);
  });

  it('should validate EC CEDULA successfully', () => {
    const result = service.validate('1710034065', 'EC', 'CEDULA');
    expect(result.success).toBe(true);
  });

  it('should fail for invalid EC CEDULA', () => {
    const result = service.validate('1234567890', 'EC', 'CEDULA');
    expect(result.success).toBe(false);
  });

  it('should validate AR CUI successfully', () => {
    const result = service.validate('20123456786', 'AR', 'CUI');
    expect(result.success).toBe(true);
  });

  it('should be case-insensitive for country and type', () => {
    const result = service.validate('1710034065', 'ec', 'cedula');
    expect(result.success).toBe(true);
  });

  it('should return error for unsupported country', () => {
    const result = service.validate('12345', 'XX', 'CEDULA');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0].code).toBe('STRATEGY_RESOLUTION_ERROR');
    }
  });

  it('should return error for unsupported type', () => {
    const result = service.validate('12345', 'EC', 'UNKNOWN');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0].code).toBe('STRATEGY_RESOLUTION_ERROR');
    }
  });

  it('should return supported countries', () => {
    const countries = service.getSupportedCountries();
    expect(countries).toContain('EC');
    expect(countries).toContain('AR');
  });

  it('should return supported types for a country', () => {
    const types = service.getSupportedTypes('EC');
    expect(types).toContain('CEDULA');
  });
});
