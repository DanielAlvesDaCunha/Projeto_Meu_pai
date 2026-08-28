"use client";

import { useActionState, useState } from "react";
import { PhotoGalleryEditor } from "@/components/admin/PhotoGalleryEditor";
import { saveProduct, type AdminFormState } from "@/lib/actions/admin";
import { parseGallery } from "@/lib/money";

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
  gallery?: string;
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
  const [images, setImages] = useState(() =>
    parseGallery(product?.gallery || "[]", product?.image || "").slice(0, 4)
  );

  const mainImage = images[0] || "";
  const galleryText = images.slice(1).join("\n");

  return (
    <form action={action} className="admin-form">
      {product?.id != null && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="image" value={mainImage} />
      <input type="hidden" name="gallery" value={galleryText} />

      <div className="form-field">
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" defaultValue={product?.name || ""} required />
      </div>
      <div className="form-field">
        <label htmlFor="sku">SKU</label>
        <input id="sku" name="sku" defaultValue={product?.sku || ""} required />
      </div>
      <div className="form-field">
        <label htmlFor="categoryId">Tipo (Gibbiflora, Echeveria…)</label>
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
          <label htmlFor="oldPrice">Preço antigo (promoção / riscado)</label>
          <input
            id="oldPrice"
            name="oldPrice"
            defaultValue={product?.oldPrice || ""}
            inputMode="decimal"
          />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="stock">Estoque (0 = Esgotado na vitrine)</label>
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
        <label>Fotos do anúncio</label>
        <PhotoGalleryEditor images={images} onChange={setImages} disabled={pending} />
      </div>
      <label className="check-row">
        <input name="featured" type="checkbox" defaultChecked={product?.featured} />
        Promoção na home (lista em /promocoes)
      </label>
      <label className="check-row">
        <input name="available" type="checkbox" defaultChecked={product?.available ?? true} />
        Visível na loja (desmarque para ocultar; estoque 0 = Esgotado)
      </label>
      {state.error && <p className="form-error">{state.error}</p>}
      <button type="submit" className="btn-buy" disabled={pending}>
        {pending ? "Salvando…" : "Salvar produto"}
      </button>
    </form>
  );
}
