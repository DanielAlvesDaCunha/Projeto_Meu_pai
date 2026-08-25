"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { prisma, hasUsableDatabaseUrl } from "@/lib/prisma";

export type AuthFormState = {
  error?: string;
  ok?: boolean;
};

export async function registerCustomer(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  if (!hasUsableDatabaseUrl()) {
    return { error: "Banco de dados indisponível. Configure DATABASE_URL." };
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!name || !email || password.length < 6) {
    return { error: "Preencha nome, e-mail e senha (mín. 6 caracteres)." };
  }
  if (password !== confirm) {
    return { error: "As senhas não conferem." };
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { error: "Já existe uma conta com este e-mail." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/conta",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Conta criada, mas o login falhou. Tente entrar." };
    }
    throw error;
  }

  return { ok: true };
}

export async function loginUser(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const callbackUrl = String(formData.get("callbackUrl") || "/conta");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl.startsWith("/") ? callbackUrl : "/conta",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail ou senha inválidos." };
    }
    throw error;
  }

  return { ok: true };
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfile(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const { requireSession } = await import("@/lib/session");
  const sessionUser = await requireSession();

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const address = String(formData.get("address") || "").trim();

  if (!name) return { error: "Nome é obrigatório." };

  await prisma.user.update({
    where: { id: sessionUser.id },
    data: { name, phone, city, address },
  });

  return { ok: true };
}
