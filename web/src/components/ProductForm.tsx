"use client";

import { useActionState, useState } from "react";
import { saveProduct, type AdminFormState } from "@/lib/actions/admin";

const initial: AdminFormState = {};

type CategoryOpt = { id: number; name: string };

type ProductFormValues = {
  id?: number;
  name?: string;
  sku?: string;
  description?: string;
  categoryId?: number;
  price?: string;
  oldPrice?: string;
  stock?: number;
  image?: string;
  featured?: boolean;
  available?: boolean;
};

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOpt[];
  product?: ProductFormValues;
}) {
  const [state, action, pending] = useActionState(saveProduct, initial);
  const [image, setImage] = useState(product?.image || "");
  const [uploading, setUploading] = useState(false);

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha no upload");
      setImage(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="admin-form">
      {product?.id != null && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="image" value={image} />

      <div className="form-field">
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" defaultValue={product?.name || ""} required />
      </div>
      <div className="form-field">
        <label htmlFor="sku">SKU</label>
        <input id="sku" name="sku" defaultValue={product?.sku || ""} required />
      </div>
      <div className="form-field">
        <label htmlFor="categoryId">Categoria</label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId || categories[0]?.id}
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description || ""}
        />
      </div>
      <div className="admin-grid-2">
        <div className="form-field">
          <label htmlFor="price">Preço (R$)</label>
          <input
            id="price"
            name="price"
            defaultValue={product?.price || ""}
            required
            inputMode="decimal"
          />
        </div>
        <div className="form-field">
          <label htmlFor="oldPrice">Preço antigo (promo)</label>
          <input
            id="oldPrice"
            name="oldPrice"
            defaultValue={product?.oldPrice || ""}
            inputMode="decimal"
          />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="stock">Estoque (quantidade)</label>
        <input
          id="stock"
          name="stock"
          type="number"
          min={0}
          defaultValue={product?.stock ?? 0}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="photo">Foto do anúncio</label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => onUpload(e.target.files?.[0] || null)}
        />
        {uploading && <p className="muted">Enviando foto…</p>}
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="Preview" className="admin-thumb" />
        )}
      </div>
      <label className="check-row">
        <input name="featured" type="checkbox" defaultChecked={product?.featured} />
        Destaque (Promoções)
      </label>
      <label className="check-row">
        <input name="available" type="checkbox" defaultChecked={product?.available ?? true} />
        Disponível para venda
      </label>
      {state.error && <p className="form-error">{state.error}</p>}
      <button type="submit" className="btn-buy" disabled={pending || uploading}>
        {pending ? "Salvando…" : "Salvar produto"}
      </button>
    </form>
  );
}
