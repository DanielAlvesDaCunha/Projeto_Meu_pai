"use client";

import { useState } from "react";
import { useAdminEdit } from "@/components/admin/AdminEditContext";
import { ProductEditModal } from "@/components/admin/ProductEditModal";
import { ProductCard } from "@/components/ProductCard";
import { money, type ProductDTO } from "@/lib/money";

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
        <ProductCard product={product} />
        <div className="editable-product-overlay">
          <div className="editable-product-meta">
            <span className="editable-product-stock">
              Estoque: <strong>{stock}</strong>
            </span>
            <span className="editable-product-price">{money(product.price)}</span>
          </div>
          <button type="button" className="btn-edit-card" onClick={() => setOpen(true)}>
            Editar anúncio
          </button>
        </div>
      </div>
      <ProductEditModal product={product} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
