"use client";

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
    <CartProvider storeName={storeName} whatsappNumber={whatsappNumber}>
      {children}
    </CartProvider>
  );
}
