# @platform/validation

Framework-agnostic validation library built with **Clean Architecture** and **Domain-Driven Design (DDD)**, abstracting **Zod V4** as the underlying validation engine.

## Features

- 🏗️ **Clean Architecture**: Domain, Application, Infrastructure layers clearly separated
- 🎯 **DDD Value Objects**: `Identification`, `Email`, `Phone` as immutable value objects
- 🌎 **Country-specific validation**: Strategy + Registry pattern for identification documents
- 🔌 **Framework-agnostic**: Core is pure TypeScript, NestJS integration is optional
- 📦 **Prebuilt validators**: Ready-to-use validators for common identification types
- 🔄 **Extensible**: Add new countries/document types without modifying existing code (OCP)

## Supported Identification Types

| Country | Type | Description |
|---------|------|-------------|
| Ecuador (EC) | CEDULA | Cédula de Identidad — 10 digits, module 10 algorithm |
| Ecuador (EC) | RUC | Registro Único de Contribuyentes — 13 digits, module 10/11 |
| Colombia (CO) | CEDULA | Cédula de Ciudadanía — 6-10 digits |
| Colombia (CO) | NIT | Número de Identificación Tributaria — module 11 with prime coefficients |
| Argentina (AR) | CUI | CUI/CUIL — 11 digits, module 11 algorithm |

## Quick Start

### Using Prebuilt Validators

```typescript
import { IdentificationValidators, EmailValidators, PhoneValidators } from '@platform/validation';

// Validate an Ecuadorian cédula
const result = IdentificationValidators.ecuador.cedula().validate('1710034065');
if (result.success) {
  console.log('Valid!', result.data);
} else {
  console.log('Invalid:', result.errors);
}

// Dynamic country resolution
const validator = IdentificationValidators.forCountry('CO', 'NIT');
const nitResult = validator.validate('123456789');

// Email validation
const emailResult = EmailValidators.standard().validate('user@example.com');

// Phone validation by country
const phoneResult = PhoneValidators.withCountryCode('EC').validate('0991234567');
```

### Using the Schema Builder (Zod Abstraction)

```typescript
import { ZodSchemaAdapter } from '@platform/validation';

const builder = new ZodSchemaAdapter();
const userValidator = builder.object({
  name: builder.string().min(1).max(100),
  email: builder.string().email(),
  age: builder.number().min(0).max(150),
}).toValidator();

const result = userValidator.validate({ name: 'John', email: 'john@example.com', age: 30 });
```

### Using the Validator Factory

```typescript
import { ValidatorFactory, ZodSchemaAdapter } from '@platform/validation';

const factory = new ValidatorFactory(new ZodSchemaAdapter());

const userValidator = factory.create((s) =>
  s.object({
    name: s.string().min(1),
    email: s.string().email(),
    age: s.number().min(0),
  })
);
```

### NestJS Integration

```typescript
import { Module } from '@nestjs/common';
import { ValidationModule } from '@platform/validation';

@Module({
  imports: [
    ValidationModule.forRoot({
      isGlobal: true,
      strategies: [/* additional custom strategies */],
    }),
  ],
})
export class AppModule {}
```

Using the validation pipe:

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { PlatformValidationPipe, IdentificationValidators } from '@platform/validation';

@Controller('users')
export class UserController {
  @Post()
  createUser(
    @Body('cedula', new PlatformValidationPipe(IdentificationValidators.ecuador.cedula()))
    cedula: string,
  ) {
    return { cedula };
  }
}
```

## Adding a New Country / Document Type

1. Create a strategy in `infrastructure/strategies/identification/{country}/`:

```typescript
import { IIdentificationStrategy } from '@platform/validation';

export class MyDocumentStrategy implements IIdentificationStrategy {
  readonly country = 'XX';
  readonly type = 'MY_DOC';

  validate(value: string): ValidationResult<string> {
    // Your validation logic
  }
}
```

2. Register it:

```typescript
import { CountryValidationRegistry, IdentificationValidators } from '@platform/validation';

const registry = IdentificationValidators.getDefaultRegistry() as CountryValidationRegistry;
const strategy = new MyDocumentStrategy();
registry.register(strategy.country, strategy.type, strategy);
```

## Architecture

```
domain/        → Ports, interfaces, value objects (pure TypeScript)
application/   → Services, factories (orchestration)
infrastructure/→ Zod adapters, strategy implementations, registry
prebuilt/      → Ready-to-use validator facades
integrations/  → Framework-specific adapters (NestJS)
```

## Testing

```bash
npm test
```
