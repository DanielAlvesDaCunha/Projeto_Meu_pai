import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    slug: "gibbifloras",
    name: "Gibbifloras",
    order: 1,
    comingSoon: false,
    description:
      "Confira as variedades de Suculentas Echeverias Gibbifloras disponíveis na Paulo Suculentas.",
  },
  {
    slug: "echeverias",
    name: "Echeverias",
    order: 2,
    comingSoon: false,
    description: "Confira as variedades de Echeverias disponíveis na Paulo Suculentas.",
  },
  {
    slug: "haworthia",
    name: "Haworthia",
    order: 3,
    comingSoon: true,
    description: "Em breve no estoque.",
  },
  {
    slug: "graptopetalum",
    name: "Graptopetalum",
    order: 4,
    comingSoon: true,
    description: "Em breve no estoque.",
  },
  {
    slug: "sedum",
    name: "Sedum",
    order: 5,
    comingSoon: true,
    description: "Em breve no estoque.",
  },
  {
    slug: "crassula",
    name: "Crassula",
    order: 6,
    comingSoon: true,
    description: "Em breve no estoque.",
  },
  {
    slug: "aeonium",
    name: "Aeonium",
    order: 7,
    comingSoon: true,
    description: "Em breve no estoque.",
  },
  {
    slug: "lithops",
    name: "Lithops",
    order: 8,
    comingSoon: true,
    description: "Em breve no estoque.",
  },
  {
    slug: "cactos",
    name: "Cactos",
    order: 20,
    comingSoon: false,
    description: "Cactos para coleção e decoração.",
  },
  {
    slug: "kits",
    name: "Kits",
    order: 21,
    comingSoon: false,
    description: "Kits variados de plantas.",
  },
];

const HERO_SLIDES = [
  {
    kicker: "",
    title: "Todas as suculentas e cactos",
    ctaHref: "/produtos",
    ctaLabel: "Ver catálogo",
    image:
      "https://images.unsplash.com/photo-1459156212016-c8128e64e80f?auto=format&fit=crop&w=1600&q=80",
    alt: "Todas as suculentas e cactos",
    badges: false,
    order: 1,
  },
  {
    kicker: "Pedido fácil pelo",
    title: "WhatsApp",
    ctaHref: "/como-pedir",
    ctaLabel: "Como pedir",
    image:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1600&q=80",
    alt: "Mudas",
    badges: false,
    order: 2,
  },
  {
    kicker: "Fotos reais das",
    title: "mudas",
    ctaHref: "/produtos",
    ctaLabel: "Ver produtos",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=80",
    alt: "Variedades",
    badges: false,
    order: 3,
  },
];

const PRODUCTS = [
  {
    category: "echeverias",
    name: "Echeveria Raindrops PT 11",
    sku: "ECH-RAIN-11",
    price: "28.00",
    oldPrice: "32.00",
    featured: true,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1501004318641-b39e64514be8?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    category: "gibbifloras",
    name: "Gibbiflora Variada PT 9",
    sku: "GIB-VAR-09",
    price: "26.00",
    oldPrice: "30.00",
    featured: true,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1485955900004-4eecf6f8bb41?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1459411552884-841db9b3aa2f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1463936577429-48e3ccee649f?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    category: "echeverias",
    name: "Echeveria Roman PT 9",
    sku: "ECH-ROM-09",
    price: "16.00",
    oldPrice: null,
    featured: true,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    category: "gibbifloras",
    name: "Gibbiflora Colorida PT 11",
    sku: "GIB-COL-11",
    price: "29.00",
    oldPrice: "34.00",
    featured: true,
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1463936577429-48e3ccee649f?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1485955900004-4eecf6f8bb41?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1459411552884-841db9b3aa2f?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    category: "echeverias",
    name: "Echeveria Lilacina PT 9",
    sku: "ECH-LIL-09",
    price: "24.00",
    oldPrice: null,
    featured: false,
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80&sat=-20",
    gallery: [
      "https://images.unsplash.com/photo-1501004318641-b39e64514be8?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    category: "kits",
    name: "Kit 6 Suculentas Variadas PT 6",
    sku: "KIT-SUC-06",
    price: "69.00",
    oldPrice: "84.00",
    featured: false,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1459411552884-841db9b3aa2f?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    category: "kits",
    name: "Kit Iniciante PT 9",
    sku: "KIT-INI-09",
    price: "49.00",
    oldPrice: "58.00",
    featured: false,
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1459411552884-841db9b3aa2f?auto=format&fit=crop&w=900&q=80",
    gallery: [],
  },
  {
    category: "cactos",
    name: "Cacto Variado PT 6",
    sku: "CAC-VAR-06",
    price: "14.00",
    oldPrice: "18.00",
    featured: false,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    category: "cactos",
    name: "Opuntia Microdasys PT 9",
    sku: "OPU-MIC-09",
    price: "26.00",
    oldPrice: null,
    featured: false,
    stock: 9,
    image:
      "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    category: "cactos",
    name: "Echinocactus Grusonii PT 11",
    sku: "ECH-GRU-11",
    price: "39.00",
    oldPrice: "45.00",
    featured: false,
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1459411552884-841db9b3aa2f?auto=format&fit=crop&w=900&q=80&sat=-40",
    gallery: [],
  },
  {
    category: "cactos",
    name: "Mammillaria PT 9",
    sku: "MAM-PT-09",
    price: "20.00",
    oldPrice: "24.00",
    featured: false,
    stock: 11,
    image:
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80&sat=-50",
    gallery: [],
  },
];

function guessCategorySlug(name: string, sku: string) {
  const key = `${name} ${sku}`.toLowerCase();
  if (key.includes("gibbi") || key.includes("gib-")) return "gibbifloras";
  if (key.includes("echeveria") || key.includes("ech-rain") || key.includes("ech-rom")) {
    return "echeverias";
  }
  if (key.includes("kit") || key.includes("kit-")) return "kits";
  if (
    key.includes("cacto") ||
    key.includes("opuntia") ||
    key.includes("mammillaria") ||
    key.includes("echinocactus") ||
    key.startsWith("cac-") ||
    key.startsWith("opu-") ||
    key.startsWith("mam-")
  ) {
    return "cactos";
  }
  return "gibbifloras";
}

async function main() {
  const adminEmails = (process.env.ADMIN_EMAIL || "admin@paulosuculentas.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  for (const email of adminEmails) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      await prisma.user.update({
        where: { email },
        data: { role: "ADMIN" },
      });
      continue;
    }

    await prisma.user.create({
      data: {
        name: "Administrador",
        email,
        passwordHash,
        role: "ADMIN",
        phone: process.env.WHATSAPP_LABEL || "",
      },
    });
  }

  const adminEmail = adminEmails[0] || "admin@paulosuculentas.com";
  const cats: Record<string, number> = {};

  for (const cat of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        order: cat.order,
        comingSoon: cat.comingSoon,
        description: cat.description,
      },
      create: cat,
    });
    cats[cat.slug] = row.id;
  }

  // Migrar produtos da categoria genérica "suculentas" e remover depois
  const legacy = await prisma.category.findUnique({ where: { slug: "suculentas" } });
  if (legacy) {
    const legacyProducts = await prisma.product.findMany({ where: { categoryId: legacy.id } });
    for (const p of legacyProducts) {
      const slug = guessCategorySlug(p.name, p.sku);
      await prisma.product.update({
        where: { id: p.id },
        data: { categoryId: cats[slug] || cats.gibbifloras },
      });
    }
    await prisma.category.delete({ where: { id: legacy.id } });
  }

  // Reclassificar SKUs conhecidos do seed antigo
  const remaps: Array<{ sku: string; category: string }> = [
    { sku: "ECH-RAIN-11", category: "echeverias" },
    { sku: "ECH-ROM-09", category: "echeverias" },
    { sku: "GRA-LULU-09", category: "gibbifloras" },
    { sku: "HAW-ZEB-09", category: "gibbifloras" },
    { sku: "SED-BUR-11", category: "kits" },
    { sku: "CRA-OVA-11", category: "kits" },
    { sku: "ALO-MIN-09", category: "kits" },
  ];
  for (const row of remaps) {
    const target = cats[row.category];
    if (!target) continue;
    await prisma.product.updateMany({
      where: { sku: row.sku },
      data: { categoryId: target },
    });
  }

  let created = 0;
  for (const item of PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { sku: item.sku } });
    if (existing) {
      await prisma.product.update({
        where: { sku: item.sku },
        data: {
          categoryId: cats[item.category],
          name: item.name,
          stock: item.stock,
          featured: item.featured,
          available: true,
          oldPrice: item.oldPrice ? new Prisma.Decimal(item.oldPrice) : null,
          price: new Prisma.Decimal(item.price),
          image: item.image,
          gallery: JSON.stringify(item.gallery || []),
        },
      });
      continue;
    }
    await prisma.product.create({
      data: {
        categoryId: cats[item.category],
        name: item.name,
        sku: item.sku,
        description: "Planta selecionada. Pedido pelo WhatsApp.",
        price: new Prisma.Decimal(item.price),
        oldPrice: item.oldPrice ? new Prisma.Decimal(item.oldPrice) : null,
        featured: item.featured,
        available: true,
        stock: item.stock,
        image: item.image,
        gallery: JSON.stringify(item.gallery || []),
      },
    });
    created += 1;
  }

  // Esgotados continuam visíveis na vitrine (estoque 0)
  await prisma.product.updateMany({
    where: { stock: { lte: 0 } },
    data: { available: true },
  });

  for (const slide of HERO_SLIDES) {
    const existing = await prisma.heroSlide.findFirst({
      where: { order: slide.order },
    });
    if (existing) {
      await prisma.heroSlide.update({
        where: { id: existing.id },
        data: slide,
      });
    } else {
      await prisma.heroSlide.create({ data: slide });
    }
  }

  console.log(`Seed ok. Novos produtos: ${created}. Admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
