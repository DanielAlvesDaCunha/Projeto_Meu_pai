"use client";

import { useState } from "react";
import { useAdminEdit } from "@/components/admin/AdminEditContext";
import { ProductEditModal } from "@/components/admin/ProductEditModal";
import { ProductCard } from "@/components/ProductCard";
import type { ProductDTO } from "@/lib/money";

const DEMO_ID_START = 9000;

export function EditableProductCard({ product }: { product: ProductDTO }) {
  const { editMode } = useAdminEdit();
  const [open, setOpen] = useState(false);
  const stock = product.stock ?? 0;
  const isDemo = product.id >= DEMO_ID_START;

  if (!editMode || isDemo) {
    return <ProductCard product={product} />;
  }

  return (
    <>
      <div className="editable-product-wrap">
        <button
          type="button"
          className="editable-product-hit"
          onClick={() => setOpen(true)}
          aria-label={`Editar ${product.name}`}
        >
          <ProductCard product={product} preview />
        </button>
        <div className="editable-product-bar">
          <span>
            Estoque <strong>{stock}</strong>
          </span>
          <button type="button" className="btn-edit-card" onClick={() => setOpen(true)}>
            Editar anúncio
          </button>
        </div>
      </div>
      <ProductEditModal product={product} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
