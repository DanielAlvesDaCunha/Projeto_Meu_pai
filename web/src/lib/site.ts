export const SITE_ORIGIN = "https://www.paulosuculentas.com.br";

export function isProductionVercelAppHost(host: string) {
  return process.env.VERCEL_ENV === "production" && host.replace(/:\d+$/, "").endsWith(".vercel.app");
}
