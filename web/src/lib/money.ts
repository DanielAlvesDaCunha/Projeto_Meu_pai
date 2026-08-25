export function money(value: number | string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function installmentText(price: number | string) {
  const p = Number(price);
  const n = p < 20 ? 3 : Math.min(6, Math.max(3, Math.floor(p / 5)));
  const parcela = p / n;
  return `${n} x de ${money(parcela)}`;
}

export function pixPrice(price: number | string) {
  return Number(price) * 0.97;
}

export function discountPercent(price: number | string, oldPrice?: number | string | null) {
  if (oldPrice == null) return null;
  const p = Number(price);
  const o = Number(oldPrice);
  if (o <= p) return null;
  return Math.round(((o - p) / o) * 100);
}

export type ProductDTO = {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  oldPrice: number | null;
  image: string;
  featured: boolean;
  categorySlug?: string;
};

export function toProductDTO(p: {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: { toString(): string } | number;
  oldPrice: { toString(): string } | number | null;
  image: string;
  featured: boolean;
  category?: { slug: string };
}): ProductDTO {
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    description: p.description,
    price: Number(p.price),
    oldPrice: p.oldPrice != null ? Number(p.oldPrice) : null,
    image: p.image,
    featured: p.featured,
    categorySlug: p.category?.slug,
  };
}
