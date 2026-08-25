import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export async function requireSession(callbackUrl = "/conta") {
  const user = await getSessionUser();
  if (!user) redirect(`/entrar?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return user;
}

export async function requireAdminSession() {
  const user = await requireSession("/admin");
  if (user.role !== "ADMIN") redirect("/conta");
  return user;
}

export async function getDbUser(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } });
}

export function isAdminRole(role?: Role | string | null) {
  return role === "ADMIN";
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}
