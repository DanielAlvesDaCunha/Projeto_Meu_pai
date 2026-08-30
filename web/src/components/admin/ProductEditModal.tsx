"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import {
  imagesToGalleryText,
  PhotoGalleryEditor,
} from "@/components/admin/PhotoGalleryEditor";
import { adjustProductStock, quickSaveProduct, type AdminFormState } from "@/lib/actions/admin";
import type { ProductDTO } from "@/lib/money";

const initial: AdminFormState = {};

type Props = {
  product: ProductDTO;
  open: boolean;
  onClose: () => void;
};

export function ProductEditModal({ product, open, onClose }: Props) {
  const router = useRouter();
  const [state, action, pending] = useActionState(quickSaveProduct, initial);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [oldPrice, setOldPrice] = useState(product.oldPrice != null ? String(product.oldPrice) : "");
  const [stock, setStock] = useState(product.stock ?? 0);
  const [featured, setFeatured] = useState(product.featured);
  const [available, setAvailable] = useState((product.stock ?? 0) > 0);
  const [images, setImages] = useState(product.images.length ? product.images : product.image ? [product.image] : []);
  const [stockPending, setStockPending] = useState(false);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(product.name);
    setPrice(String(product.price));
    setOldPrice(product.oldPrice != null ? String(product.oldPrice) : "");
    setStock(product.stock ?? 0);
    setFeatured(product.featured);
    setAvailable((product.stock ?? 0) > 0);
    setImages(product.images.length ? product.images : product.image ? [product.image] : []);
  }, [open, product]);

  useEffect(() => {
    if (!state.ok) return;
    onClose();
    router.refresh();
  }, [state.ok, onClose, router]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.classList.add("product-edit-open");
    const media = window.matchMedia("(max-width: 900px)");
    const syncPhone = () => setIsPhone(media.matches);
    syncPhone();
    media.addEventListener("change", syncPhone);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("product-edit-open");
      media.removeEventListener("change", syncPhone);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const preview: ProductDTO = {
    ...product,
    name,
    price: Number(price) || product.price,
    oldPrice: oldPrice ? Number(oldPrice) : null,
    stock,
    featured,
    image: images[0] || "",
    images,
  };

  const mainImage = images[0] || "";
  const galleryText = imagesToGalleryText(images);

  async function changeStock(delta: number) {
    setStockPending(true);
    try {
      const formData = new FormData();
      formData.set("id", String(product.id));
      formData.set("delta", String(delta));
      await adjustProductStock(formData);
      setStock((current) => Math.max(0, current + delta));
      if (stock + delta <= 0) setAvailable(false);
      if (stock + delta > 0) setAvailable(true);
    } finally {
      setStockPending(false);
    }
  }

  return (
    <div className={`product-edit-backdrop${isPhone ? " is-phone" : ""}`} onClick={onClose}>
      <div
        className="product-edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-edit-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="product-edit-head">
          <div>
            <p className="product-edit-kicker">Editar anúncio</p>
            <h2 id="product-edit-title">{product.name}</h2>
          </div>
          <button type="button" className="product-edit-close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </header>

        <div className="product-edit-body">
          <form id="product-edit-form" action={action} className="product-edit-form">
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="image" value={mainImage} />
            <input type="hidden" name="gallery" value={galleryText} />
            <input type="hidden" name="featured" value={featured ? "true" : "false"} />
            <input type="hidden" name="available" value={available ? "true" : "false"} />
            <input type="hidden" name="stock" value={stock} />

            <div className="form-field">
              <label htmlFor={`edit-name-${product.id}`}>Nome da planta</label>
              <input
                id={`edit-name-${product.id}`}
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="admin-grid-2">
              <div className="form-field">
                <label htmlFor={`edit-price-${product.id}`}>Preço (R$)</label>
                <input
                  id={`edit-price-${product.id}`}
                  name="price"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  inputMode="decimal"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor={`edit-old-price-${product.id}`}>Preço antigo (opcional)</label>
                <input
                  id={`edit-old-price-${product.id}`}
                  name="oldPrice"
                  value={oldPrice}
                  onChange={(event) => setOldPrice(event.target.value)}
                  inputMode="decimal"
                />
              </div>
            </div>

            <div className="form-field">
              <label>Estoque</label>
              <div className="stock-stepper">
                <button
                  type="button"
                  onClick={() => void changeStock(-1)}
                  disabled={stockPending || stock <= 0}
                  aria-label="Diminuir estoque"
                >
                  −
                </button>
                <strong>{stock}</strong>
                <button
                  type="button"
                  onClick={() => void changeStock(1)}
                  disabled={stockPending}
                  aria-label="Aumentar estoque"
                >
                  +
                </button>
              </div>
              <p className="muted">0 unidades = aparece como esgotado na loja.</p>
            </div>

            <PhotoGalleryEditor images={images} onChange={setImages} disabled={pending} />

            <label className="check-row">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
              />
              Mostrar em promoções
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={available}
                onChange={(event) => setAvailable(event.target.checked)}
                disabled={stock <= 0}
              />
              Visível na loja
            </label>

            {state.error && <p className="form-error">{state.error}</p>}
          </form>

          <section className="product-edit-preview">
            <details className="product-edit-preview-toggle" open={!isPhone}>
              <summary>Ver como fica na loja</summary>
              <div className="product-edit-preview-card">
                <ProductCard product={preview} />
              </div>
            </details>
          </section>
        </div>
        <div className="product-edit-actions">
          <button type="button" className="btn-edit-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="product-edit-form" className="btn-buy" disabled={pending || stockPending}>
            {pending ? "Salvando…" : "Salvar anúncio"}
          </button>
        </div>
      </div>
    </div>
  );
}
