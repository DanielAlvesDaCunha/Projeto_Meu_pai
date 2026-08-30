import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { isProductionVercelAppHost, SITE_ORIGIN } from "@/lib/site";

const { auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || process.env.SECRET_KEY,
});

export default auth((req) => {
  const host = req.headers.get("host") || "";
  if (isProductionVercelAppHost(host)) {
    const dest = new URL(req.nextUrl.pathname + req.nextUrl.search, SITE_ORIGIN);
    return NextResponse.redirect(dest, 308);
  }

  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user?.id;
  const role = req.auth?.user?.role || "CUSTOMER";

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/entrar" || pathname.startsWith("/admin/entrar/")) {
      if (isLoggedIn && role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      const url = new URL("/admin/entrar", req.nextUrl);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/conta", req.nextUrl));
    }
  }

  if (pathname.startsWith("/conta")) {
    if (!isLoggedIn) {
      const url = new URL("/entrar", req.nextUrl);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
