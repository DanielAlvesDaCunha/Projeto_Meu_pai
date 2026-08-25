"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, slugify } from "@/lib/session";

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

  revalidatePath("/");
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function deleteProduct(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/produtos");
}

export async function saveCategory(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdminSession();
  const idRaw = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const order = Number(formData.get("order") || 0);
  let slug = String(formData.get("slug") || "").trim() || slugify(name);

  if (!name || !slug) return { error: "Nome e slug são obrigatórios." };

  try {
    if (idRaw) {
      await prisma.category.update({
        where: { id: Number(idRaw) },
        data: { name, slug, order: Number.isFinite(order) ? order : 0 },
      });
    } else {
      await prisma.category.create({
        data: { name, slug, order: Number.isFinite(order) ? order : 0 },
      });
    }
  } catch {
    return { error: "Não foi possível salvar a categoria (slug duplicado?)." };
  }

  revalidatePath("/");
  revalidatePath("/admin/categorias");
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
      ...(qty <= 0 ? { available: false } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
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
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
}
