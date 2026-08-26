import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

/**
 * Config sem Prisma — pode rodar no Edge (middleware).
 * Providers e authorize ficam em auth.ts (Node).
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/entrar",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id || "");
        session.user.role = (token.role as Role) || "CUSTOMER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
