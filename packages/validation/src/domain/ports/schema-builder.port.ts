import { IValidator } from './validator.port';

/**
 * Schema representation that can be used to create validators.
 * This is the output of the schema builder methods.
 *
 * @template T - The type that the schema validates to
 */
export interface ISchema<T> {
  /**
   * Creates a validator from this schema.
   */
  toValidator(): IValidator<T>;
}

/**
 * Fluent schema builder port that abstracts the underlying validation library.
 * Consumers program against this interface, never directly against Zod or any other library.
 * Framework-agnostic - pure TypeScript.
 */
export interface ISchemaBuilder {
  /**
   * Creates a string schema.
   */
  string(): IStringSchema;

  /**
   * Creates a number schema.
   */
  number(): INumberSchema;

  /**
   * Creates a boolean schema.
   */
  boolean(): ISchema<boolean>;

  /**
   * Creates an object schema from a shape definition.
   * @param shape - A record of property names to their schemas
   */
  object<T extends Record<string, ISchema<unknown>>>(
    shape: T,
  ): ISchema<{ [K in keyof T]: T[K] extends ISchema<infer U> ? U : never }>;

  /**
   * Creates an array schema.
   * @param itemSchema - The schema for array items
   */
  array<T>(itemSchema: ISchema<T>): ISchema<T[]>;

  /**
   * Creates an enum schema.
   * @param values - Allowed enum values
   */
  enum<T extends string>(values: readonly T[]): ISchema<T>;
}

/**
 * String schema with chainable refinements.
 */
export interface IStringSchema extends ISchema<string> {
  /** Minimum length constraint */
  min(length: number, message?: string): IStringSchema;
  /** Maximum length constraint */
  max(length: number, message?: string): IStringSchema;
  /** Exact length constraint */
  length(length: number, message?: string): IStringSchema;
  /** Email format validation */
  email(message?: string): IStringSchema;
  /** Regex pattern validation */
  regex(pattern: RegExp, message?: string): IStringSchema;
  /** Mark as optional (allows undefined) */
  optional(): ISchema<string | undefined>;
  /** Custom refinement */
  refine(
    check: (value: string) => boolean,
    message?: string,
  ): IStringSchema;
}

/**
 * Number schema with chainable refinements.
 */
export interface INumberSchema extends ISchema<number> {
  /** Minimum value constraint */
  min(value: number, message?: string): INumberSchema;
  /** Maximum value constraint */
  max(value: number, message?: string): INumberSchema;
  /** Integer constraint */
  int(message?: string): INumberSchema;
  /** Positive number constraint */
  positive(message?: string): INumberSchema;
  /** Mark as optional (allows undefined) */
  optional(): ISchema<number | undefined>;
  /** Custom refinement */
  refine(
    check: (value: number) => boolean,
    message?: string,
  ): INumberSchema;
}
