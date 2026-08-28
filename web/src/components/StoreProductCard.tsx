"use client";

import { EditableProductCard } from "@/components/admin/EditableProductCard";
import { useAdminEdit } from "@/components/admin/AdminEditContext";
import { ProductCard } from "@/components/ProductCard";
import type { ProductDTO } from "@/lib/money";

export function StoreProductCard({ product }: { product: ProductDTO }) {
  const { isAdmin } = useAdminEdit();

  if (isAdmin) {
    return <EditableProductCard product={product} />;
  }

  return <ProductCard product={product} />;
}
