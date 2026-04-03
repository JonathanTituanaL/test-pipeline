import { IdentificationType } from './identification-type.enum';

/**
 * Value Object representing a validated identification document.
 * Immutable after creation. Can only be constructed via the static factory method.
 *
 * Framework-agnostic - pure TypeScript.
 */
export class Identification {
  private constructor(
    private readonly _value: string,
    private readonly _country: string,
    private readonly _type: IdentificationType,
  ) {}

  /**
   * Creates a new Identification value object.
   * This factory method does NOT perform validation — it assumes the value has
   * already been validated by the appropriate strategy.
   *
   * @param value - The validated identification string
   * @param country - ISO 3166-1 alpha-2 country code
   * @param type - The identification document type
   */
  static create(
    value: string,
    country: string,
    type: IdentificationType,
  ): Identification {
    return new Identification(value, country, type);
  }

  get value(): string {
    return this._value;
  }

  get country(): string {
    return this._country;
  }

  get type(): IdentificationType {
    return this._type;
  }

  /**
   * Checks equality with another Identification value object.
   */
  equals(other: Identification): boolean {
    return (
      this._value === other._value &&
      this._country === other._country &&
      this._type === other._type
    );
  }

  toString(): string {
    return `${this._country}-${this._type}:${this._value}`;
  }
}
