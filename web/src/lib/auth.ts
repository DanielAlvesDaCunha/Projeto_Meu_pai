import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import type { Role } from "@prisma/client";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}

function authSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || process.env.SECRET_KEY;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: authSecret(),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // Promove automaticamente e-mails listados em ADMIN_EMAIL
        const adminEmails = (process.env.ADMIN_EMAIL || "admin@paulosuculentas.com")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);
        let role = user.role;
        if (adminEmails.includes(user.email) && role !== "ADMIN") {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
          role = "ADMIN";
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role,
        };
      },
    }),
  ],
});

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}
