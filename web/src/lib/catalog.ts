export function normalizeSearchQuery(q?: string | null) {
  return String(q || "").trim();
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
