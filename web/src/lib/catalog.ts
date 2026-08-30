export function normalizeSearchQuery(q?: string | null) {
  return String(q || "").trim();
}

/** Três destaques na home: carrossel e banners. */
export const MAIN_CAROUSEL_SLUGS = ["gibbifloras", "echeverias", "cactos"] as const;

export type MainCarouselSlug = (typeof MAIN_CAROUSEL_SLUGS)[number];

export const MAIN_CAROUSEL_LABELS: Record<MainCarouselSlug, string> = {
  gibbifloras: "Gibbifloras",
  echeverias: "Echeverias",
  cactos: "Cactos",
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

/** Anúncios novos ficam em Lançamentos por este prazo. */
export const LANCAMENTOS_DAYS = 30;

export function lancamentosSince(from = new Date()) {
  const date = new Date(from);
  date.setDate(date.getDate() - LANCAMENTOS_DAYS);
  return date;
}

export const PRIMARY_NAV = [
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/servicos", label: "Serviços" },
  { href: "/como-pedir", label: "Como pedir" },
  { href: "/contato", label: "Contato" },
] as const;

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

/** Tipos no menu e no filtro: Gibbifloras, Echeverias, Cactos, depois o restante (sem Kits). */
export function shopTypeNav(categories: NavCategory[]): NavCategory[] {
  const bySlug = new Map(categories.map((cat) => [cat.slug, cat]));
  const featured: NavCategory[] = MAIN_CAROUSEL_SLUGS.map((slug) => {
    const cat = bySlug.get(slug);
    return {
      slug,
      name: cat?.name ?? MAIN_CAROUSEL_LABELS[slug],
      comingSoon: cat?.comingSoon,
      description: cat?.description,
      id: cat?.id,
      order: cat?.order,
    };
  });
  const rest = categories.filter(
    (cat) => cat.slug !== "suculentas" && cat.slug !== "kits" && !isMainCarouselSlug(cat.slug)
  );
  return [...featured, ...rest];
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
