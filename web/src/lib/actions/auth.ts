"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { getAdminEmails } from "@/lib/admin-emails";
import { prisma, describeDatabaseUrlIssue, hasUsableDatabaseUrl } from "@/lib/prisma";
import { resolveLoginRedirect } from "@/lib/session";

export type AuthFormState = {
  error?: string;
  ok?: boolean;
};

export async function registerCustomer(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  if (!hasUsableDatabaseUrl()) {
    return { error: describeDatabaseUrlIssue() || "Banco de dados indisponível." };
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
  const callbackUrl = String(formData.get("callbackUrl") || "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  if (!hasUsableDatabaseUrl()) {
    return { error: describeDatabaseUrlIssue() || "Banco de dados indisponível." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) {
    return { error: "E-mail ou senha inválidos." };
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return { error: "E-mail ou senha inválidos." };
  }

  const redirectTo = resolveLoginRedirect(user.role, callbackUrl);

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail ou senha inválidos." };
    }
    throw error;
  }

  return { ok: true };
}

/** Login exclusivo do painel — só conta ADMIN. */
export async function loginAdmin(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const callbackUrl = String(formData.get("callbackUrl") || "/admin");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  if (!hasUsableDatabaseUrl()) {
    return { error: describeDatabaseUrlIssue() || "Banco de dados indisponível." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) {
    return { error: "E-mail ou senha inválidos." };
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return { error: "E-mail ou senha inválidos." };
  }

  const adminEmails = getAdminEmails();

  const willBeAdmin = user.role === "ADMIN" || adminEmails.includes(email);
  if (!willBeAdmin) {
    return {
      error:
        "Esta conta não é de lojista. Peça para colocar este e-mail em ADMIN_EMAIL na Vercel, ou use a conta admin.",
    };
  }

  const redirectTo =
    callbackUrl.startsWith("/admin") && !callbackUrl.startsWith("/admin/entrar")
      ? callbackUrl
      : "/admin";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
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

export async function logoutAdmin() {
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
