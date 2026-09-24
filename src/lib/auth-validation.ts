export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MIN_LENGTH_MESSAGE = `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır.`;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_VALIDATION_MESSAGE = `Kullanıcı adı ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} karakter olmalı, Türkçe karakterler, büyük/küçük harf ve rakam kullanılabilir.`;

export function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= PASSWORD_MIN_LENGTH;
}

export function isValidUsername(username: unknown): username is string {
  if (typeof username !== "string") return false;
  const trimmed = username.trim();
  if (trimmed.length < USERNAME_MIN_LENGTH || trimmed.length > USERNAME_MAX_LENGTH) return false;
  return /^[A-Za-zÇçĞğİıÖöŞşÜü0-9._-]+$/.test(trimmed);
}

export function passwordsMatch(password: unknown, confirmation: unknown) {
  return typeof password === "string" && password === confirmation;
}