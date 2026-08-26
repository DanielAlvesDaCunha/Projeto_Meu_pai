/** Catálogo de demonstração com fotos públicas da web (Unsplash). */

export type DemoProduct = {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  oldPrice: number | null;
  image: string;
  images: string[];
  featured: boolean;
  stock: number;
};

export type DemoCategory = {
  id: number;
  name: string;
  slug: string;
  order: number;
  comingSoon: boolean;
  description: string;
  products: DemoProduct[];
};

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const GALLERY = {
  ech: [
    img("photo-1509423350716-97f9360b4e09"),
    img("photo-1512428813834-c702c7702b78"),
    img("photo-1501004318641-b39e64514be8"),
  ],
  gib: [
    img("photo-1459411552884-841db9b3aa2f"),
    img("photo-1485955900004-4eecf6f8bb41"),
    img("photo-1463936577429-48e3ccee649f"),
  ],
  kit: [img("photo-1416879595882-3373a0480b5b"), img("photo-1459411552884-841db9b3aa2f")],
  cac: [img("photo-1509937528035-ad76254b0356"), img("photo-1519331379826-f10be5486c6f")],
};

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 9001,
    name: "Echeveria Raindrops PT 11",
    sku: "DEMO-ECH-01",
    description: "Exemplo",
    price: 28,
    oldPrice: 32,
    featured: true,
    stock: 10,
    image: GALLERY.ech[0],
    images: GALLERY.ech,
  },
  {
    id: 9002,
    name: "Gibbiflora Variada PT 9",
    sku: "DEMO-GIB-02",
    description: "Exemplo",
    price: 26,
    oldPrice: 30,
    featured: true,
    stock: 8,
    image: GALLERY.gib[0],
    images: GALLERY.gib,
  },
  {
    id: 9003,
    name: "Echeveria Colorida PT 9",
    sku: "DEMO-ECH-03",
    description: "Exemplo",
    price: 22,
    oldPrice: null,
    featured: true,
    stock: 0,
    image: GALLERY.ech[1],
    images: [GALLERY.ech[1], GALLERY.ech[0], GALLERY.ech[2]],
  },
  {
    id: 9004,
    name: "Kit Suculentas Variadas",
    sku: "DEMO-KIT-04",
    description: "Exemplo",
    price: 69,
    oldPrice: 84,
    featured: true,
    stock: 5,
    image: GALLERY.kit[0],
    images: GALLERY.kit,
  },
  {
    id: 9005,
    name: "Cacto Mini PT 6",
    sku: "DEMO-CAC-05",
    description: "Exemplo",
    price: 14,
    oldPrice: 18,
    featured: false,
    stock: 12,
    image: GALLERY.cac[0],
    images: GALLERY.cac,
  },
  {
    id: 9006,
    name: "Cacto Ornamental PT 9",
    sku: "DEMO-CAC-06",
    description: "Exemplo",
    price: 26,
    oldPrice: null,
    featured: false,
    stock: 4,
    image: GALLERY.cac[1],
    images: [...GALLERY.cac].reverse(),
  },
  {
    id: 9007,
    name: "Gibbiflora em Vaso PT 11",
    sku: "DEMO-GIB-07",
    description: "Exemplo esgotado",
    price: 35,
    oldPrice: 40,
    featured: false,
    stock: 0,
    image: GALLERY.gib[1],
    images: [GALLERY.gib[1], GALLERY.gib[0], GALLERY.gib[2]],
  },
  {
    id: 9008,
    name: "Echeveria Roseta PT 9",
    sku: "DEMO-ECH-08",
    description: "Exemplo",
    price: 24,
    oldPrice: 29,
    featured: true,
    stock: 7,
    image: GALLERY.ech[2],
    images: [GALLERY.ech[2], GALLERY.ech[0], GALLERY.ech[1]],
  },
];

const soon = (id: number, name: string, slug: string, order: number): DemoCategory => ({
  id,
  name,
  slug,
  order,
  comingSoon: true,
  description: "Em breve no estoque.",
  products: [],
});

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    id: 1,
    name: "Gibbifloras",
    slug: "gibbifloras",
    order: 1,
    comingSoon: false,
    description:
      "Confira as variedades de Suculentas Echeverias Gibbifloras disponíveis na Paulo Suculentas.",
    products: DEMO_PRODUCTS.filter((p) => p.sku.includes("GIB")),
  },
  {
    id: 2,
    name: "Echeverias",
    slug: "echeverias",
    order: 2,
    comingSoon: false,
    description: "Confira as variedades de Echeverias disponíveis na Paulo Suculentas.",
    products: DEMO_PRODUCTS.filter((p) => p.sku.includes("ECH")),
  },
  soon(3, "Haworthia", "haworthia", 3),
  soon(4, "Graptopetalum", "graptopetalum", 4),
  soon(5, "Sedum", "sedum", 5),
  soon(6, "Crassula", "crassula", 6),
  soon(7, "Aeonium", "aeonium", 7),
  soon(8, "Lithops", "lithops", 8),
  {
    id: 20,
    name: "Cactos",
    slug: "cactos",
    order: 20,
    comingSoon: false,
    description: "Cactos para coleção e decoração.",
    products: DEMO_PRODUCTS.filter((p) => p.sku.includes("CAC")),
  },
  {
    id: 21,
    name: "Kits",
    slug: "kits",
    order: 21,
    comingSoon: false,
    description: "Kits variados de plantas.",
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
