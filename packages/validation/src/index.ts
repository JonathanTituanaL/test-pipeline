// ============================================================================
// @platform/validation
// Framework-agnostic validation library with Clean Architecture and DDD
// ============================================================================

// ---------------------------------------------------------------------------
// Domain Layer - Ports & Interfaces
// ---------------------------------------------------------------------------
export type { ValidationError } from './domain/ports/validation-result';
export type { ValidationResult } from './domain/ports/validation-result';
export { ValidationResult as ValidationResultFactory } from './domain/ports/validation-result';
export type { IValidator } from './domain/ports/validator.port';
export type {
  ISchemaBuilder,
  ISchema,
  IStringSchema,
  INumberSchema,
} from './domain/ports/schema-builder.port';
export type { IIdentificationStrategy } from './domain/strategies/identification-strategy.port';
export type { ICountryValidationRegistry } from './domain/registries/country-registry.port';

// ---------------------------------------------------------------------------
// Domain Layer - Value Objects
// ---------------------------------------------------------------------------
export { Identification } from './domain/value-objects/identification/identification.vo';
export { IdentificationType } from './domain/value-objects/identification/identification-type.enum';
export { Email } from './domain/value-objects/email.vo';
export { Phone } from './domain/value-objects/phone.vo';

// ---------------------------------------------------------------------------
// Application Layer - Services & Factories
// ---------------------------------------------------------------------------
export { ValidationService } from './application/services/validation.service';
export { IdentificationValidationService } from './application/services/identification-validation.service';
export { ValidatorFactory } from './application/factories/validator.factory';

// ---------------------------------------------------------------------------
// Infrastructure Layer - Adapters
// ---------------------------------------------------------------------------
export { ZodSchemaAdapter } from './infrastructure/adapters/zod/zod-schema.adapter';
export { ZodValidatorAdapter } from './infrastructure/adapters/zod/zod-validator.adapter';
export {
  createIdentificationSchema,
  createIdentificationValidator,
} from './infrastructure/adapters/zod/zod-refinements';

// ---------------------------------------------------------------------------
// Infrastructure Layer - Strategies
// ---------------------------------------------------------------------------
export { CedulaEcuadorStrategy } from './infrastructure/strategies/identification/ecuador/cedula-ecuador.strategy';
export { RucEcuadorStrategy } from './infrastructure/strategies/identification/ecuador/ruc-ecuador.strategy';
export { CedulaColombiaStrategy } from './infrastructure/strategies/identification/colombia/cedula-colombia.strategy';
export { NitColombiaStrategy } from './infrastructure/strategies/identification/colombia/nit-colombia.strategy';
export { CuiArgentinaStrategy } from './infrastructure/strategies/identification/argentina/cui-argentina.strategy';

// ---------------------------------------------------------------------------
// Infrastructure Layer - Registry
// ---------------------------------------------------------------------------
export { CountryValidationRegistry } from './infrastructure/registries/country-validation.registry';

// ---------------------------------------------------------------------------
// Prebuilt Validators (Facades)
// ---------------------------------------------------------------------------
export { IdentificationValidators } from './prebuilt/identification.validators';
export { EmailValidators } from './prebuilt/email.validators';
export { PhoneValidators } from './prebuilt/phone.validators';

// ---------------------------------------------------------------------------
// NestJS Integration (Optional)
// ---------------------------------------------------------------------------
export {
  ValidationModule,
  SCHEMA_BUILDER,
  COUNTRY_REGISTRY,
  VALIDATION_SERVICE,
  IDENTIFICATION_SERVICE,
  VALIDATOR_FACTORY,
} from './integrations/nestjs/validation.module';
export type { ValidationModuleOptions } from './integrations/nestjs/validation.module';
export { PlatformValidationPipe } from './integrations/nestjs/validation.pipe';
export { Validate } from './integrations/nestjs/decorators/validate.decorator';
