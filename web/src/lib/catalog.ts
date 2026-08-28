export function normalizeSearchQuery(q?: string | null) {
  return String(q || "").trim();
}

/** Três destaques na home: carrossel e banners. */
export const MAIN_CAROUSEL_SLUGS = ["suculentas", "cactos", "kits"] as const;

export type MainCarouselSlug = (typeof MAIN_CAROUSEL_SLUGS)[number];

export const MAIN_CAROUSEL_LABELS: Record<MainCarouselSlug, string> = {
  suculentas: "Suculentas",
  cactos: "Cactos",
  kits: "Kits",
};

/** Tipos de suculenta que ainda não vendem — mostram badge no menu. */
export const FUTURE_SUCCULENT_TYPE_SLUGS = new Set([
  "haworthia",
  "graptopetalum",
  "sedum",
  "crassula",
  "aeonium",
  "lithops",
]);

export const SUCCULENT_TYPE_SLUGS = new Set([
  "suculentas",
  "gibbifloras",
  "echeverias",
  ...FUTURE_SUCCULENT_TYPE_SLUGS,
]);

export const ALL_CATEGORY_SLUGS = new Set([
  ...SUCCULENT_TYPE_SLUGS,
  "cactos",
  "kits",
]);

export const FUTURE_TYPE_LABEL = "Em breve";

export function categoryHref(slug: string) {
  return `/produtos/${slug}`;
}

export function isFutureProductType(slug: string, comingSoon?: boolean) {
  if (FUTURE_SUCCULENT_TYPE_SLUGS.has(slug)) return true;
  return comingSoon === true;
}

export type NavCategory = {
  id?: number;
  slug: string;
  name: string;
  comingSoon?: boolean;
  description?: string;
  order?: number;
};

export function normalizeNavCategory<T extends NavCategory>(category: T): T {
  return {
    ...category,
    comingSoon: isFutureProductType(category.slug, category.comingSoon),
  };
}

export function normalizeNavCategories<T extends NavCategory>(categories: T[]) {
  return categories.map(normalizeNavCategory);
}

export function isMainCarouselSlug(slug: string): slug is MainCarouselSlug {
  return (MAIN_CAROUSEL_SLUGS as readonly string[]).includes(slug);
}

export function matchesProductSearch(
  product: { name: string; description?: string; sku?: string },
  q?: string | null
) {
  const query = normalizeSearchQuery(q).toLowerCase();
  if (!query) return true;
  return [product.name, product.description || "", product.sku || ""].some((field) =>
    field.toLowerCase().includes(query)
  );
}

export function buildProductTextSearch(q?: string | null) {
  const query = normalizeSearchQuery(q);
  if (!query) return undefined;
  return {
    OR: [
      { name: { contains: query, mode: "insensitive" as const } },
      { description: { contains: query, mode: "insensitive" as const } },
      { sku: { contains: query, mode: "insensitive" as const } },
    ],
  };
}
