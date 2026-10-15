/** Login username rules (shared by the login API, login form and seed/migration scripts). */
export const USERNAME_DOMAIN = "@mkcl.org";
export const MAX_FAILED_ATTEMPTS = 5; // account is disabled once failed attempts go beyond this

/** Returns an error message, or null if the username is acceptable. */
export function usernameError(raw: string): string | null {
  const u = raw.trim();
  if (!u) return "Username is required.";
  if (!/^[A-Za-z]/.test(u)) return "Username must start with a letter (not a number or special character).";
  if (!u.toLowerCase().endsWith(USERNAME_DOMAIN)) return `Username must end with ${USERNAME_DOMAIN}`;
  if (u.length <= USERNAME_DOMAIN.length) return "Username is incomplete.";
  return null;
}
