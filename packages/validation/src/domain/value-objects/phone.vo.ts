/**
 * Value Object representing a validated phone number.
 * Immutable after creation.
 *
 * Framework-agnostic - pure TypeScript.
 */
export class Phone {
  private constructor(
    private readonly _number: string,
    private readonly _countryCode: string,
  ) {}

  /**
   * Creates a new Phone value object.
   * Assumes the value has already been validated.
   *
   * @param number - The phone number digits
   * @param countryCode - The country dialing code (e.g. '+593', '+57', '+54')
   */
  static create(number: string, countryCode: string): Phone {
    const sanitized = number.replace(/\D/g, '');
    return new Phone(sanitized, countryCode);
  }

  get number(): string {
    return this._number;
  }

  get countryCode(): string {
    return this._countryCode;
  }

  /**
   * Returns the full phone number with country code.
   */
  get fullNumber(): string {
    return `${this._countryCode}${this._number}`;
  }

  equals(other: Phone): boolean {
    return (
      this._number === other._number &&
      this._countryCode === other._countryCode
    );
  }

  toString(): string {
    return this.fullNumber;
  }
}
