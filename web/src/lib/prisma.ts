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
export function describeDatabaseUrlIssue(): string | null {
  const url = process.env.DATABASE_URL || "";
  if (!url.trim()) {
    return "DATABASE_URL não está configurada. Na Vercel: Storage → Postgres (Neon) → copie a connection string.";
  }
  if (url.includes("suculentas_psql") || url.includes("@postgres:")) {
    if (process.env.VERCEL) {
      return "DATABASE_URL aponta para o Docker local. Na Vercel use a URL do Neon (postgres.neon.tech), não suculentas_psql.";
    }
  }
  return null;
}

export function hasUsableDatabaseUrl() {
  return describeDatabaseUrlIssue() === null;
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
