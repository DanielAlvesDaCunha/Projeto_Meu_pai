"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminEdit } from "@/components/admin/AdminEditContext";
import { ProductEditModal } from "@/components/admin/ProductEditModal";
import { ProductCard } from "@/components/ProductCard";
import { deleteProduct } from "@/lib/actions/admin";
import type { ProductDTO } from "@/lib/money";

const DEMO_ID_START = 9000;

export function EditableProductCard({ product }: { product: ProductDTO }) {
  const { editMode } = useAdminEdit();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const stock = product.stock ?? 0;
  const isDemo = product.id >= DEMO_ID_START;

  if (!editMode || isDemo) {
    return <ProductCard product={product} />;
  }

  async function onDelete(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (deleting) return;
    const ok = window.confirm(`Excluir “${product.name}”? Ele some da loja.`);
    if (!ok) return;
    setDeleting(true);
    const formData = new FormData();
    formData.set("id", String(product.id));
    const result = await deleteProduct(formData);
    setDeleting(false);
    if (result && "error" in result && result.error) {
      window.alert(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <>
      <div className="editable-product-wrap">
        <button
          type="button"
          className="editable-product-delete"
          onClick={onDelete}
          disabled={deleting}
          aria-label={`Excluir ${product.name}`}
        >
          ×
        </button>
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
