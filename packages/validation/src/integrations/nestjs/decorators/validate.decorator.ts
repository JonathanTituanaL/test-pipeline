import { applyDecorators, UsePipes } from '@nestjs/common';
import { IValidator } from '../../../domain/ports/validator.port';
import { PlatformValidationPipe } from '../validation.pipe';

/**
 * Method decorator that applies validation to the incoming request body.
 * Wraps the IValidator in a NestJS pipe.
 *
 * @param validator - The validator to apply
 *
 * @example
 * ```ts
 * @Post()
 * @Validate(myValidator)
 * createUser(@Body() dto: CreateUserDto) {
 *   // dto is already validated
 * }
 * ```
 */
export function Validate<T>(validator: IValidator<T>) {
  return applyDecorators(UsePipes(new PlatformValidationPipe(validator)));
}
