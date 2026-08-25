import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: "suculentas", name: "Suculentas", order: 1 },
  { slug: "cactos", name: "Cactos", order: 2 },
  { slug: "kits", name: "Kits", order: 3 },
];

const PRODUCTS = [
  {
    category: "suculentas",
    name: "Echeveria Raindrops PT 11",
    sku: "ECH-RAIN-11",
    price: "28.00",
    oldPrice: "32.00",
    featured: true,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "suculentas",
    name: "Graptoveria Lulu PT 9",
    sku: "GRA-LULU-09",
    price: "18.00",
    oldPrice: "22.00",
    featured: true,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1485955900004-4eecf6f8bb41?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "suculentas",
    name: "Echeveria Roman PT 9",
    sku: "ECH-ROM-09",
    price: "16.00",
    oldPrice: null,
    featured: true,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "suculentas",
    name: "Haworthia Zebra PT 9",
    sku: "HAW-ZEB-09",
    price: "24.00",
    oldPrice: "29.00",
    featured: true,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1463936577429-48e3ccee649f?auto=format&fit=crop&w=900&q=80",
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
  },
  {
    category: "kits",
    name: "Sedum Burrito PT 11",
    sku: "SED-BUR-11",
    price: "32.00",
    oldPrice: "38.00",
    featured: false,
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1459411552884-841db9b3aa2f?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "kits",
    name: "Crassula Ovata PT 11",
    sku: "CRA-OVA-11",
    price: "35.00",
    oldPrice: null,
    featured: false,
    stock: 4,
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e64514be8?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "kits",
    name: "Aloe Vera Mini PT 9",
    sku: "ALO-MIN-09",
    price: "22.00",
    oldPrice: "26.00",
    featured: false,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80&sat=-30",
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
  },
];

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@paulosuculentas.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Administrador",
      passwordHash,
      role: "ADMIN",
    },
    create: {
      name: "Administrador",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      phone: process.env.WHATSAPP_LABEL || "",
    },
  });

  const cats: Record<string, number> = {};

  for (const cat of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, order: cat.order },
      create: cat,
    });
    cats[cat.slug] = row.id;
  }

  await prisma.product.deleteMany({ where: { category: { slug: "gibbifloras" } } });
  await prisma.category.deleteMany({ where: { slug: "gibbifloras" } });

  let created = 0;
  for (const item of PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { sku: item.sku } });
    if (existing) {
      await prisma.product.update({
        where: { sku: item.sku },
        data: {
          stock: existing.stock > 0 ? existing.stock : item.stock,
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
      },
    });
    created += 1;
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
