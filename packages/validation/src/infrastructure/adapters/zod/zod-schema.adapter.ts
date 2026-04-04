import { z } from 'zod';
import {
  ISchemaBuilder,
  ISchema,
  IStringSchema,
  INumberSchema,
} from '../../../domain/ports/schema-builder.port';
import { IValidator } from '../../../domain/ports/validator.port';
import { ZodValidatorAdapter } from './zod-validator.adapter';

/**
 * Base wrapper that adapts a Zod type into the ISchema port.
 */
class ZodSchemaWrapper<T> implements ISchema<T> {
  constructor(protected zodSchema: z.ZodType<T>) {}

  toValidator(): IValidator<T> {
    return new ZodValidatorAdapter(this.zodSchema);
  }
}

/**
 * Adapter wrapping Zod's string schema with fluent chainable methods.
 */
class ZodStringSchemaAdapter
  extends ZodSchemaWrapper<string>
  implements IStringSchema
{
  constructor(schema: z.ZodString) {
    super(schema);
  }

  min(length: number, message?: string): IStringSchema {
    this.zodSchema = (this.zodSchema as z.ZodString).min(length, message);
    return this;
  }

  max(length: number, message?: string): IStringSchema {
    this.zodSchema = (this.zodSchema as z.ZodString).max(length, message);
    return this;
  }

  length(len: number, message?: string): IStringSchema {
    this.zodSchema = (this.zodSchema as z.ZodString).length(len, message);
    return this;
  }

  email(message?: string): IStringSchema {
    this.zodSchema = (this.zodSchema as z.ZodString).email(message);
    return this;
  }

  regex(pattern: RegExp, message?: string): IStringSchema {
    this.zodSchema = (this.zodSchema as z.ZodString).regex(pattern, message);
    return this;
  }

  optional(): ISchema<string | undefined> {
    return new ZodSchemaWrapper(this.zodSchema.optional());
  }

  refine(check: (value: string) => boolean, message?: string): IStringSchema {
    this.zodSchema = this.zodSchema.refine(check, {
      message: message ?? 'Validation failed',
    }) as unknown as z.ZodString;
    return this;
  }
}

/**
 * Adapter wrapping Zod's number schema with fluent chainable methods.
 */
class ZodNumberSchemaAdapter
  extends ZodSchemaWrapper<number>
  implements INumberSchema
{
  constructor(schema: z.ZodNumber) {
    super(schema);
  }

  min(value: number, message?: string): INumberSchema {
    this.zodSchema = (this.zodSchema as z.ZodNumber).min(value, message);
    return this;
  }

  max(value: number, message?: string): INumberSchema {
    this.zodSchema = (this.zodSchema as z.ZodNumber).max(value, message);
    return this;
  }

  int(message?: string): INumberSchema {
    this.zodSchema = (this.zodSchema as z.ZodNumber).int(message);
    return this;
  }

  positive(message?: string): INumberSchema {
    this.zodSchema = (this.zodSchema as z.ZodNumber).min(
      1,
      message ?? 'Number must be positive',
    );
    return this;
  }

  optional(): ISchema<number | undefined> {
    return new ZodSchemaWrapper(this.zodSchema.optional());
  }

  refine(check: (value: number) => boolean, message?: string): INumberSchema {
    this.zodSchema = this.zodSchema.refine(check, {
      message: message ?? 'Validation failed',
    }) as unknown as z.ZodNumber;
    return this;
  }
}

/**
 * Zod-backed implementation of ISchemaBuilder.
 * Translates the generic schema builder port into Zod V4 API calls.
 *
 * To switch from Zod to another library, replace this adapter.
 */
export class ZodSchemaAdapter implements ISchemaBuilder {
  string(): IStringSchema {
    return new ZodStringSchemaAdapter(z.string());
  }

  number(): INumberSchema {
    return new ZodNumberSchemaAdapter(z.number());
  }

  boolean(): ISchema<boolean> {
    return new ZodSchemaWrapper(z.boolean());
  }

  object<T extends Record<string, ISchema<unknown>>>(
    shape: T,
  ): ISchema<{ [K in keyof T]: T[K] extends ISchema<infer U> ? U : never }> {
    const zodShape: Record<string, z.ZodType> = {};
    for (const [key, schema] of Object.entries(shape)) {
      const wrapper = schema as ZodSchemaWrapper<unknown>;
      zodShape[key] = wrapper['zodSchema'];
    }
    type ResultType = {
      [K in keyof T]: T[K] extends ISchema<infer U> ? U : never;
    };
    return new ZodSchemaWrapper<ResultType>(
      z.object(zodShape) as unknown as z.ZodType<ResultType>,
    );
  }

  array<T>(itemSchema: ISchema<T>): ISchema<T[]> {
    const wrapper = itemSchema as ZodSchemaWrapper<T>;
    return new ZodSchemaWrapper(z.array(wrapper['zodSchema']));
  }

  enum<T extends string>(values: readonly T[]): ISchema<T> {
    return new ZodSchemaWrapper(
      z.enum(values as unknown as [string, ...string[]]) as unknown as z.ZodType<T>,
    );
  }
}
