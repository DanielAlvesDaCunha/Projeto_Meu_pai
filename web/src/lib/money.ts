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
  return `${n} x de ${money(parcela)} sem juros`;
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
  images: string[];
  featured: boolean;
  stock?: number;
  categorySlug?: string;
};

export function parseGallery(gallery?: string | string[] | null, fallbackImage = ""): string[] {
  let extras: string[] = [];
  if (Array.isArray(gallery)) {
    extras = gallery;
  } else if (typeof gallery === "string" && gallery.trim()) {
    try {
      const parsed = JSON.parse(gallery);
      if (Array.isArray(parsed)) extras = parsed.map(String);
    } catch {
      extras = gallery
        .split(/\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  const list = [fallbackImage, ...extras].map((s) => s.trim()).filter(Boolean);
  return [...new Set(list)];
}

export function toProductDTO(p: {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: { toString(): string } | number;
  oldPrice: { toString(): string } | number | null;
  image: string;
  gallery?: string | string[] | null;
  images?: string[];
  featured: boolean;
  stock?: number;
  category?: { slug: string };
}): ProductDTO {
  const images =
    p.images && p.images.length
      ? [...new Set(p.images.map((s) => s.trim()).filter(Boolean))]
      : parseGallery(p.gallery, p.image);
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    description: p.description,
    price: Number(p.price),
    oldPrice: p.oldPrice != null ? Number(p.oldPrice) : null,
    image: images[0] || p.image || "",
    images: images.length ? images : p.image ? [p.image] : [],
    featured: p.featured,
    stock: p.stock,
    categorySlug: p.category?.slug,
  };
}
