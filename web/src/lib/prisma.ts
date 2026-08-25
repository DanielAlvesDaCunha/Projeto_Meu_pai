import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const FALLBACK_CATEGORIES = [
  { id: 1, name: "Suculentas", slug: "suculentas", order: 1 },
  { id: 2, name: "Cactos", slug: "cactos", order: 2 },
  { id: 3, name: "Kits", slug: "kits", order: 3 },
];

/** Docker hostname only works inside compose — never on Vercel. */
export function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  if (!url) return false;
  // Vercel cannot resolve Docker hostnames; allow them only inside Compose.
  if (url.includes("suculentas_psql")) {
    return Boolean(process.env.POSTGRES_HOST) && !process.env.VERCEL;
  }
  return true;
}

export async function getNavCategories() {
  if (!hasUsableDatabaseUrl()) {
    return FALLBACK_CATEGORIES;
  }
  try {
    return await prisma.category.findMany({ orderBy: { order: "asc" } });
  } catch (error) {
    console.error("getNavCategories failed:", error);
    return FALLBACK_CATEGORIES;
  }
}
