import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const FALLBACK_CATEGORIES = [
  { id: 1, name: "Gibbifloras", slug: "gibbifloras", order: 1, comingSoon: false, description: "Gibbifloras selecionadas para a loja." },
  { id: 2, name: "Echeverias", slug: "echeverias", order: 2, comingSoon: false, description: "Echeverias em vasos e mudas." },
  { id: 3, name: "Haworthia", slug: "haworthia", order: 3, comingSoon: true, description: "Em breve no estoque." },
  { id: 4, name: "Graptopetalum", slug: "graptopetalum", order: 4, comingSoon: true, description: "Em breve no estoque." },
  { id: 5, name: "Sedum", slug: "sedum", order: 5, comingSoon: true, description: "Em breve no estoque." },
  { id: 6, name: "Crassula", slug: "crassula", order: 6, comingSoon: true, description: "Em breve no estoque." },
  { id: 7, name: "Aeonium", slug: "aeonium", order: 7, comingSoon: true, description: "Em breve no estoque." },
  { id: 8, name: "Lithops", slug: "lithops", order: 8, comingSoon: true, description: "Em breve no estoque." },
  { id: 20, name: "Cactos", slug: "cactos", order: 20, comingSoon: false, description: "Cactos para coleção e decoração." },
  { id: 21, name: "Kits", slug: "kits", order: 21, comingSoon: false, description: "Kits variados de plantas." },
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
