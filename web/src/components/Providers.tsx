"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart";
import type { ReactNode } from "react";

export function Providers({
  children,
  storeName,
  whatsappNumber,
}: {
  children: ReactNode;
  storeName: string;
  whatsappNumber: string;
}) {
  return (
    <SessionProvider>
      <CartProvider storeName={storeName} whatsappNumber={whatsappNumber}>
        {children}
      </CartProvider>
    </SessionProvider>
  );
}
