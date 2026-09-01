"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, slugify } from "@/lib/session";
import { applyPaidOrderStock } from "@/lib/actions/orders";

export type AdminFormState = {
  error?: string;
  ok?: boolean;
};

function parseMoney(value: FormDataEntryValue | null) {
  const raw = String(value || "")
    .replace(",", ".")
    .trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function saveProduct(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdminSession();

  const idRaw = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const sku = String(formData.get("sku") || "")
    .trim()
    .toUpperCase();
  const description = String(formData.get("description") || "").trim();
  const categoryId = Number(formData.get("categoryId"));
  const price = parseMoney(formData.get("price"));
  const oldPrice = parseMoney(formData.get("oldPrice"));
  const stock = Number(formData.get("stock") || 0);
  const image = String(formData.get("image") || "").trim();
  const galleryRaw = String(formData.get("gallery") || "").trim();
  const galleryUrls = galleryRaw
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((url) => url !== image);
  const featured = formData.get("featured") === "on";
  const available = formData.get("available") === "on";

  if (!name || !sku || !categoryId || price == null) {
    return { error: "Preencha nome, SKU, categoria e preço." };
  }

  const data = {
    name,
    sku,
    description,
    categoryId,
    price: new Prisma.Decimal(price),
    oldPrice: oldPrice != null ? new Prisma.Decimal(oldPrice) : null,
    stock: Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0,
    image,
    gallery: JSON.stringify(galleryUrls),
    featured,
    available,
  };

  try {
    if (idRaw) {
      await prisma.product.update({
        where: { id: Number(idRaw) },
        data,
      });
    } else {
      await prisma.product.create({ data });
    }
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível salvar. Verifique se o SKU já existe." };
  }

  revalidateCatalogPaths();
  redirect("/admin/produtos");
}

export async function deleteProduct(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!id) return { error: "Anúncio inválido." };
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível excluir este anúncio." };
  }
  revalidateCatalogPaths();
  return { ok: true };
}

/** Form action da tabela admin — Next exige retorno void. */
export async function deleteProductForm(formData: FormData): Promise<void> {
  await deleteProduct(formData);
}

export async function listAdminCategories() {
  await requireAdminSession();
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, comingSoon: true },
  });
}

export async function quickCreateProduct(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdminSession();

  const name = String(formData.get("name") || "").trim();
  const price = parseMoney(formData.get("price"));
  const oldPrice = parseMoney(formData.get("oldPrice"));
  const stock = Number(formData.get("stock") || 0);
  const image = String(formData.get("image") || "").trim();
  const galleryRaw = String(formData.get("gallery") || "").trim();
  const featured = formData.get("featured") === "on" || formData.get("featured") === "true";
  const categoryId = Number(formData.get("categoryId"));

  if (!name || price == null || !categoryId) {
    return { error: "Preencha nome, preço e o tipo da planta." };
  }

  const qty = Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0;
  const sku = `${slugify(name).slice(0, 18) || "anuncio"}-${Date.now().toString(36)}`.toUpperCase();

  try {
    await prisma.product.create({
      data: {
        name,
        sku,
        description: "Planta selecionada. Pedido pelo WhatsApp.",
        categoryId,
        price: new Prisma.Decimal(price),
        oldPrice: oldPrice != null ? new Prisma.Decimal(oldPrice) : null,
        stock: qty,
        image,
        gallery: parseGalleryInput(galleryRaw, image),
        featured,
        available: qty > 0,
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível criar o anúncio. Tente de novo." };
  }

  revalidateCatalogPaths();
  return { ok: true };
}

export async function saveCategory(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdminSession();
  const idRaw = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const order = Number(formData.get("order") || 0);
  const description = String(formData.get("description") || "").trim();
  const comingSoon = formData.get("comingSoon") === "on";
  let slug = String(formData.get("slug") || "").trim() || slugify(name);

  if (!name || !slug) return { error: "Nome e slug são obrigatórios." };

  const data = {
    name,
    slug,
    order: Number.isFinite(order) ? order : 0,
    description,
    comingSoon,
  };

  try {
    if (idRaw) {
      await prisma.category.update({
        where: { id: Number(idRaw) },
        data,
      });
    } else {
      await prisma.category.create({ data });
    }
  } catch {
    return { error: "Não foi possível salvar a categoria (slug duplicado?)." };
  }

  revalidatePath("/");
  revalidatePath("/admin/categorias");
  revalidatePath(`/produtos/${slug}`);
  revalidatePath(`/${slug}`);
  return { ok: true };
}

export async function deleteCategory(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!id) return;
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categorias");
}

function revalidateCatalogPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/produtos", "layout");
  revalidatePath("/produtos/[slug]", "page");
  revalidatePath("/produto/[id]", "page");
  revalidatePath("/promocoes");
  revalidatePath("/novidades");
  revalidatePath("/lancamentos");
  revalidatePath("/destaques");
  revalidatePath("/suculentas");
  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
  revalidatePath("/admin/banners");
}

function parseGalleryInput(raw: string, mainImage = "") {
  const urls = raw
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((url) => url !== mainImage);
  return JSON.stringify(urls.slice(0, 3));
}

export async function updateProductStock(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const stock = Number(formData.get("stock"));
  if (!id || !Number.isFinite(stock)) return;

  const qty = Math.max(0, Math.floor(stock));
  await prisma.product.update({
    where: { id },
    data: {
      stock: qty,
      available: qty > 0,
    },
  });

  revalidateCatalogPaths();
}

export async function adjustProductStock(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const delta = Number(formData.get("delta"));
  if (!id || !Number.isFinite(delta)) return;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  const qty = Math.max(0, product.stock + Math.trunc(delta));
  await prisma.product.update({
    where: { id },
    data: {
      stock: qty,
      available: qty > 0,
    },
  });

  revalidateCatalogPaths();
}

export async function quickSaveProduct(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdminSession();

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  const price = parseMoney(formData.get("price"));
  const oldPrice = parseMoney(formData.get("oldPrice"));
  const stock = Number(formData.get("stock") || 0);
  const image = String(formData.get("image") || "").trim();
  const galleryRaw = String(formData.get("gallery") || "").trim();
  const featured = formData.get("featured") === "on" || formData.get("featured") === "true";
  const available = formData.get("available") === "on" || formData.get("available") === "true";

  if (!id || !name || price == null) {
    return { error: "Preencha nome e preço." };
  }

  const qty = Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0;

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        price: new Prisma.Decimal(price),
        oldPrice: oldPrice != null ? new Prisma.Decimal(oldPrice) : null,
        stock: qty,
        image,
        gallery: parseGalleryInput(galleryRaw, image),
        featured,
        available: available && qty > 0,
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível salvar o anúncio." };
  }

  revalidateCatalogPaths();
  return { ok: true };
}

export async function toggleProductAvailable(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!id) return;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: { available: !product.available },
  });

  revalidatePath("/");
  revalidatePath("/admin/produtos");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !["PENDING", "PAID", "SHIPPED", "CANCELLED"].includes(status)) return;

  if (status === "PAID" || status === "SHIPPED") {
    await applyPaidOrderStock(id);
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: status as "PENDING" | "PAID" | "SHIPPED" | "CANCELLED",
      paymentStatus:
        status === "PAID" || status === "SHIPPED"
          ? "PAID"
          : status === "CANCELLED"
            ? "FAILED"
            : undefined,
    },
  });

  revalidateCatalogPaths();
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
}

export async function saveHeroSlide(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdminSession();

  const idRaw = String(formData.get("id") || "");
  const kicker = String(formData.get("kicker") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const ctaHref = String(formData.get("ctaHref") || "/produtos").trim() || "/produtos";
  const ctaLabel = String(formData.get("ctaLabel") || "Ver produtos").trim() || "Ver produtos";
  const image = String(formData.get("image") || "").trim();
  const alt = String(formData.get("alt") || "").trim() || title;
  const order = Number(formData.get("order") || 0);
  const badges = formData.get("badges") === "on";
  const active = formData.get("active") === "on";

  if (!title) return { error: "Informe o título do banner." };
  if (!image) return { error: "Envie uma imagem para o banner." };

  const data = {
    kicker,
    title,
    ctaHref,
    ctaLabel,
    image,
    alt,
    order: Number.isFinite(order) ? order : 0,
    badges,
    active,
  };

  try {
    if (idRaw) {
      await prisma.heroSlide.update({ where: { id: Number(idRaw) }, data });
    } else {
      await prisma.heroSlide.create({ data });
    }
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível salvar o banner." };
  }

  revalidateCatalogPaths();
  redirect("/");
}

export async function deleteHeroSlide(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.heroSlide.delete({ where: { id } });
  revalidateCatalogPaths();
}

export async function toggleHeroSlideActive(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!id) return;
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) return;
  await prisma.heroSlide.update({
    where: { id },
    data: { active: !slide.active },
  });
  revalidateCatalogPaths();
}
