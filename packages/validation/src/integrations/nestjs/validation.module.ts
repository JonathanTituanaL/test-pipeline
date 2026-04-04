import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { ISchemaBuilder } from '../../domain/ports/schema-builder.port';
import { ICountryValidationRegistry } from '../../domain/registries/country-registry.port';
import { ZodSchemaAdapter } from '../../infrastructure/adapters/zod/zod-schema.adapter';
import { CountryValidationRegistry } from '../../infrastructure/registries/country-validation.registry';
import { ValidationService } from '../../application/services/validation.service';
import { IdentificationValidationService } from '../../application/services/identification-validation.service';
import { ValidatorFactory } from '../../application/factories/validator.factory';
import { IIdentificationStrategy } from '../../domain/strategies/identification-strategy.port';

// Injection tokens
export const SCHEMA_BUILDER = Symbol('SCHEMA_BUILDER');
export const COUNTRY_REGISTRY = Symbol('COUNTRY_REGISTRY');
export const VALIDATION_SERVICE = Symbol('VALIDATION_SERVICE');
export const IDENTIFICATION_SERVICE = Symbol('IDENTIFICATION_SERVICE');
export const VALIDATOR_FACTORY = Symbol('VALIDATOR_FACTORY');

export interface ValidationModuleOptions {
  /**
   * Additional identification strategies to register.
   * These are registered alongside the default built-in strategies.
   */
  strategies?: IIdentificationStrategy[];

  /**
   * Custom schema builder implementation.
   * Defaults to ZodSchemaAdapter if not provided.
   */
  schemaBuilder?: ISchemaBuilder;

  /**
   * Whether this module is global.
   * @default false
   */
  isGlobal?: boolean;
}

/**
 * NestJS dynamic module for the @platform/validation package.
 * Registers all validation services in the NestJS DI container.
 *
 * @example
 * ```ts
 * // In your AppModule
 * import { ValidationModule } from '@platform/validation';
 *
 * @Module({
 *   imports: [
 *     ValidationModule.forRoot({
 *       strategies: [new MyCustomStrategy()],
 *       isGlobal: true,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class ValidationModule {
  static forRoot(options: ValidationModuleOptions = {}): DynamicModule {
    const providers: Provider[] = [
      {
        provide: SCHEMA_BUILDER,
        useFactory: () => options.schemaBuilder ?? new ZodSchemaAdapter(),
      },
      {
        provide: COUNTRY_REGISTRY,
        useFactory: () => {
          const registry = new CountryValidationRegistry();

          // Register default strategies
          const { CedulaEcuadorStrategy } = require('../../infrastructure/strategies/identification/ecuador/cedula-ecuador.strategy');
          const { RucEcuadorStrategy } = require('../../infrastructure/strategies/identification/ecuador/ruc-ecuador.strategy');
          const { CedulaColombiaStrategy } = require('../../infrastructure/strategies/identification/colombia/cedula-colombia.strategy');
          const { NitColombiaStrategy } = require('../../infrastructure/strategies/identification/colombia/nit-colombia.strategy');
          const { CuiArgentinaStrategy } = require('../../infrastructure/strategies/identification/argentina/cui-argentina.strategy');

          const defaults: IIdentificationStrategy[] = [
            new CedulaEcuadorStrategy(),
            new RucEcuadorStrategy(),
            new CedulaColombiaStrategy(),
            new NitColombiaStrategy(),
            new CuiArgentinaStrategy(),
          ];

          for (const strategy of defaults) {
            registry.register(strategy.country, strategy.type, strategy);
          }

          // Register additional strategies
          if (options.strategies) {
            for (const strategy of options.strategies) {
              registry.register(strategy.country, strategy.type, strategy);
            }
          }

          return registry;
        },
      },
      {
        provide: VALIDATION_SERVICE,
        useClass: ValidationService,
      },
      {
        provide: IDENTIFICATION_SERVICE,
        useFactory: (registry: ICountryValidationRegistry) =>
          new IdentificationValidationService(registry),
        inject: [COUNTRY_REGISTRY],
      },
      {
        provide: VALIDATOR_FACTORY,
        useFactory: (schemaBuilder: ISchemaBuilder) =>
          new ValidatorFactory(schemaBuilder),
        inject: [SCHEMA_BUILDER],
      },
    ];

    return {
      module: ValidationModule,
      global: options.isGlobal ?? false,
      providers,
      exports: [
        SCHEMA_BUILDER,
        COUNTRY_REGISTRY,
        VALIDATION_SERVICE,
        IDENTIFICATION_SERVICE,
        VALIDATOR_FACTORY,
      ],
    };
  }
}
