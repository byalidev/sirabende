export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MIN_LENGTH_MESSAGE = `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır.`;

export function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= PASSWORD_MIN_LENGTH;
}

export function passwordsMatch(password: unknown, confirmation: unknown) {
  return typeof password === "string" && password === confirmation;
}