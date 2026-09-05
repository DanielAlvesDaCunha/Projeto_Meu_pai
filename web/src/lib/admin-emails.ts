export const BUILTIN_ADMIN_EMAILS = [
  "admin@paulosuculentas.com",
  "pauloadri2014@gmail.com",
];

export function getAdminEmails() {
  const fromEnv = (process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set([...BUILTIN_ADMIN_EMAILS, ...fromEnv])];
}
