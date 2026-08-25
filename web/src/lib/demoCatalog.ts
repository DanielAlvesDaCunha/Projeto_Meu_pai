/** Catálogo de demonstração com fotos públicas da web (Unsplash). */

export type DemoProduct = {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  oldPrice: number | null;
  image: string;
  featured: boolean;
};

export type DemoCategory = {
  id: number;
  name: string;
  slug: string;
  order: number;
  products: DemoProduct[];
};

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 9001,
    name: "Echeveria Raindrops PT 11",
    sku: "DEMO-ECH-01",
    description: "Exemplo",
    price: 28,
    oldPrice: 32,
    featured: true,
    image: img("photo-1509423350716-97f9360b4e09"),
  },
  {
    id: 9002,
    name: "Suculenta Roseta Verde PT 9",
    sku: "DEMO-SUC-02",
    description: "Exemplo",
    price: 18,
    oldPrice: 22,
    featured: true,
    image: img("photo-1459411552884-841db9b3aa2f"),
  },
  {
    id: 9003,
    name: "Echeveria Colorida PT 9",
    sku: "DEMO-ECH-03",
    description: "Exemplo",
    price: 22,
    oldPrice: null,
    featured: true,
    image: img("photo-1512428813834-c702c7702b78"),
  },
  {
    id: 9004,
    name: "Kit Suculentas Variadas",
    sku: "DEMO-KIT-04",
    description: "Exemplo",
    price: 69,
    oldPrice: 84,
    featured: true,
    image: img("photo-1416879595882-3373a0480b5b"),
  },
  {
    id: 9005,
    name: "Cacto Mini PT 6",
    sku: "DEMO-CAC-05",
    description: "Exemplo",
    price: 14,
    oldPrice: 18,
    featured: false,
    image: img("photo-1509937528035-ad76254b0356"),
  },
  {
    id: 9006,
    name: "Cacto Ornamental PT 9",
    sku: "DEMO-CAC-06",
    description: "Exemplo",
    price: 26,
    oldPrice: null,
    featured: false,
    image: img("photo-1519331379826-f10be5486c6f"),
  },
  {
    id: 9007,
    name: "Planta de Interior PT 11",
    sku: "DEMO-PLA-07",
    description: "Exemplo",
    price: 35,
    oldPrice: 40,
    featured: false,
    image: img("photo-1485955900004-4eecf6f8bb41"),
  },
  {
    id: 9008,
    name: "Suculenta em Vaso PT 9",
    sku: "DEMO-SUC-08",
    description: "Exemplo",
    price: 24,
    oldPrice: 29,
    featured: true,
    image: img("photo-1501004318641-b39e64514be8"),
  },
];

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    id: 1,
    name: "Suculentas",
    slug: "suculentas",
    order: 1,
    products: DEMO_PRODUCTS.filter((p) => p.sku.includes("ECH") || p.sku.includes("SUC") || p.sku.includes("PLA")),
  },
  {
    id: 2,
    name: "Cactos",
    slug: "cactos",
    order: 2,
    products: DEMO_PRODUCTS.filter((p) => p.sku.includes("CAC")),
  },
  {
    id: 3,
    name: "Kits",
    slug: "kits",
    order: 3,
    products: DEMO_PRODUCTS.filter((p) => p.sku.includes("KIT")),
  },
];

export function getDemoCatalog() {
  return {
    categories: DEMO_CATEGORIES,
    featured: DEMO_PRODUCTS.filter((p) => p.featured),
    novidades: DEMO_PRODUCTS,
  };
}
