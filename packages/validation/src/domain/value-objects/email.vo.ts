/**
 * Value Object representing a validated email address.
 * Immutable after creation.
 *
 * Framework-agnostic - pure TypeScript.
 */
export class Email {
  private constructor(private readonly _value: string) {}

  /**
   * Creates a new Email value object.
   * Assumes the value has already been validated.
   *
   * @param value - The validated email string
   */
  static create(value: string): Email {
    return new Email(value.toLowerCase().trim());
  }

  get value(): string {
    return this._value;
  }

  /**
   * Returns the domain part of the email address.
   */
  get domain(): string {
    return this._value.split('@')[1];
  }

  /**
   * Returns the local part of the email address.
   */
  get localPart(): string {
    return this._value.split('@')[0];
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
