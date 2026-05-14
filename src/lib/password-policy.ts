/** Reglas alineadas con el cambio obligatorio de PIN a contraseña fuerte. */

export function validateNewPassword(password: string): boolean {
  if (password.length < 9) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) return false;
  return true;
}
