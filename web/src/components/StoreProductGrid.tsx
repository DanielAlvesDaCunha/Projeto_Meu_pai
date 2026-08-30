"use client";

import { useState } from "react";
import { useAdminEdit } from "@/components/admin/AdminEditContext";
import { ProductCreateModal } from "@/components/admin/ProductCreateModal";
import { StoreProductCard } from "@/components/StoreProductCard";
import type { ProductDTO } from "@/lib/money";

export function StoreProductGrid({
  products,
  className,
  emptyText,
  defaultCategoryId,
  defaultFeatured,
}: {
  products: ProductDTO[];
  className: string;
  emptyText?: string;
  defaultCategoryId?: number;
  defaultFeatured?: boolean;
}) {
  const { editMode } = useAdminEdit();
  const [creating, setCreating] = useState(false);

  if (!products.length && !editMode) {
    return emptyText ? <p className="muted">{emptyText}</p> : null;
  }

  return (
    <>
      <div className={className}>
        {products.map((product) => (
          <StoreProductCard key={product.id} product={product} />
        ))}
        {editMode ? (
          <button type="button" className="add-listing-tile" onClick={() => setCreating(true)}>
            <span className="add-listing-plus" aria-hidden>
              +
            </span>
            <strong>Novo anúncio</strong>
            <span>Toque para subir uma planta neste espaço</span>
          </button>
        ) : null}
      </div>
      <ProductCreateModal
        key={creating ? "open" : "closed"}
        open={creating}
        onClose={() => setCreating(false)}
        defaultCategoryId={defaultCategoryId}
        defaultFeatured={defaultFeatured}
      />
    </>
  );
}
