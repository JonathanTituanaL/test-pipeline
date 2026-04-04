import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { IValidator } from '../../domain/ports/validator.port';

/**
 * NestJS Pipe that validates input using an IValidator<T>.
 * Can be used as a global pipe or applied to specific parameters.
 *
 * @example
 * ```ts
 * // Per-parameter usage
 * @Post()
 * createUser(@Body(new PlatformValidationPipe(myValidator)) dto: CreateUserDto) {
 *   // dto is already validated
 * }
 * ```
 */
@Injectable()
export class PlatformValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly validator: IValidator<T>) {}

  transform(value: unknown, _metadata: ArgumentMetadata): T {
    const result = this.validator.validate(value);

    if (!result.success) {
      const messages = result.errors.map(
        (e) => `[${e.code}] ${e.path}: ${e.message}`,
      );
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.errors,
        details: messages,
      });
    }

    return result.data;
  }
}
