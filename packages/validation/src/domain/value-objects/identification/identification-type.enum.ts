/**
 * Enum representing supported identification document types.
 * Framework-agnostic - pure TypeScript.
 */
export enum IdentificationType {
  /** Cédula de identidad (Ecuador, Colombia) */
  CEDULA = 'CEDULA',
  /** Registro Único de Contribuyentes (Ecuador) */
  RUC = 'RUC',
  /** Número de Identificación Tributaria (Colombia) */
  NIT = 'NIT',
  /** Código Único de Identificación / CUIL (Argentina) */
  CUI = 'CUI',
}
