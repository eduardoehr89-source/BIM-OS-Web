/** NIP de eliminación de archivos: exactamente 4 dígitos. */
export const NIP_DIGITS = 4;

export function isValidNipFormat(value: string): boolean {
  return /^\d{4}$/.test(value.trim());
}
