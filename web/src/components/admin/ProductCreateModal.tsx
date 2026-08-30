"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoGalleryEditor, imagesToGalleryText } from "@/components/admin/PhotoGalleryEditor";
import { listAdminCategories, quickCreateProduct, type AdminFormState } from "@/lib/actions/admin";

const initial: AdminFormState = {};

type CategoryOpt = { id: number; name: string; slug: string; comingSoon: boolean };

type Props = {
  open: boolean;
  onClose: () => void;
  defaultCategoryId?: number;
  defaultFeatured?: boolean;
};

export function ProductCreateModal({ open, onClose, defaultCategoryId, defaultFeatured }: Props) {
  const router = useRouter();
  const [state, action, pending] = useActionState(quickCreateProduct, initial);
  const [categories, setCategories] = useState<CategoryOpt[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [featured, setFeatured] = useState(Boolean(defaultFeatured));
  const [images, setImages] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState(defaultCategoryId ? String(defaultCategoryId) : "");
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName("");
    setPrice("");
    setOldPrice("");
    setStock(1);
    setFeatured(Boolean(defaultFeatured));
    setImages([]);
    setCategoryId(defaultCategoryId ? String(defaultCategoryId) : "");
    void listAdminCategories().then((rows) => {
      setCategories(rows);
      if (!defaultCategoryId && rows[0]) setCategoryId(String(rows[0].id));
    });
  }, [open, defaultCategoryId, defaultFeatured]);

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

  const galleryText = imagesToGalleryText(images);

  return (
    <div className={`product-edit-backdrop${isPhone ? " is-phone" : ""}`} onClick={onClose}>
      <div
        className="product-edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-create-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="product-edit-head">
          <div>
            <p className="product-edit-kicker">Novo anúncio</p>
            <h2 id="product-create-title">Subir uma planta</h2>
          </div>
          <button type="button" className="product-edit-close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </header>

        <div className="product-edit-body">
          <form id="product-create-form" action={action} className="product-edit-form">
            <input type="hidden" name="image" value={images[0] || ""} />
            <input type="hidden" name="gallery" value={galleryText} />
            <input type="hidden" name="featured" value={featured ? "true" : "false"} />
            <input type="hidden" name="stock" value={stock} />

            <div className="form-field">
              <label htmlFor="create-name">Nome da planta</label>
              <input
                id="create-name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="create-category">Tipo</label>
              <select
                id="create-category"
                name="categoryId"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                    {category.comingSoon ? " (em breve)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-grid-2">
              <div className="form-field">
                <label htmlFor="create-price">Preço (R$)</label>
                <input
                  id="create-price"
                  name="price"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  inputMode="decimal"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="create-old-price">Preço antigo (opcional)</label>
                <input
                  id="create-old-price"
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
                <button type="button" onClick={() => setStock((n) => Math.max(0, n - 1))} aria-label="Diminuir estoque">
                  −
                </button>
                <strong>{stock}</strong>
                <button type="button" onClick={() => setStock((n) => n + 1)} aria-label="Aumentar estoque">
                  +
                </button>
              </div>
            </div>

            <PhotoGalleryEditor images={images} onChange={setImages} disabled={pending} />

            <label className="check-row">
              <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
              Mostrar em promoções
            </label>

            {state.error ? <p className="form-error">{state.error}</p> : null}
          </form>
        </div>
        <div className="product-edit-actions">
          <button type="button" className="btn-edit-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="product-create-form" className="btn-buy" disabled={pending || !categoryId}>
            {pending ? "Salvando…" : "Publicar anúncio"}
          </button>
        </div>
      </div>
    </div>
  );
}
