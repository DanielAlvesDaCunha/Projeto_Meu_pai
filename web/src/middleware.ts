import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || process.env.SECRET_KEY,
  });

  const isLoggedIn = !!token;
  const role = (token?.role as string) || "CUSTOMER";

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/entrar" || pathname.startsWith("/admin/entrar/")) {
      if (isLoggedIn && role === "ADMIN") {
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        url.search = "";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/entrar";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/conta";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/conta")) {
    if (!isLoggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/entrar";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (role === "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/conta", "/conta/:path*"],
};
