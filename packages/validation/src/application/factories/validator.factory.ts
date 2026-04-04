import { IValidator } from '../../domain/ports/validator.port';
import { ISchemaBuilder, ISchema } from '../../domain/ports/schema-builder.port';

/**
 * Factory for creating validators from schema definitions.
 * Decouples validator creation from the underlying schema library.
 *
 * Framework-agnostic - uses constructor injection.
 */
export class ValidatorFactory {
  constructor(private readonly schemaBuilder: ISchemaBuilder) {}

  /**
   * Creates a validator from a schema definition function.
   * The consumer provides a function that uses the schema builder
   * to define the shape, and the factory returns the validator.
   *
   * @param definitionFn - A function that receives the schema builder and returns a schema
   * @returns An IValidator instance for the defined schema
   *
   * @example
   * ```ts
   * const userValidator = factory.create((s) =>
   *   s.object({
   *     name: s.string().min(1),
   *     email: s.string().email(),
   *     age: s.number().min(0).max(150),
   *   })
   * );
   * ```
   */
  create<T>(
    definitionFn: (builder: ISchemaBuilder) => ISchema<T>,
  ): IValidator<T> {
    const schema = definitionFn(this.schemaBuilder);
    return schema.toValidator();
  }

  /**
   * Returns the underlying schema builder for advanced use cases.
   */
  getSchemaBuilder(): ISchemaBuilder {
    return this.schemaBuilder;
  }
}
