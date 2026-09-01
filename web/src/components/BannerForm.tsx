"use client";

import { useActionState, useState } from "react";
import { saveHeroSlide, type AdminFormState } from "@/lib/actions/admin";
import { uploadAdminImage } from "@/lib/uploadImage";

const initial: AdminFormState = {};

type HeroSlideValues = {
  id?: number;
  kicker?: string;
  title?: string;
  ctaHref?: string;
  ctaLabel?: string;
  image?: string;
  alt?: string;
  order?: number;
  badges?: boolean;
  active?: boolean;
};

export function BannerForm({ slide }: { slide?: HeroSlideValues }) {
  const [state, action, pending] = useActionState(saveHeroSlide, initial);
  const [image, setImage] = useState(slide?.image || "");
  const [uploading, setUploading] = useState(false);

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      setImage(await uploadAdminImage(file));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="admin-form">
      {slide?.id != null && <input type="hidden" name="id" value={slide.id} />}
      <input type="hidden" name="image" value={image} />

      <p className="muted">
        Esta foto é o banner grande da tela inicial. Depois de salvar, o site abre a home para você
        conferir.
      </p>

      <div className="form-field">
        <label htmlFor="banner-photo">Foto do banner da home</label>
        <input
          id="banner-photo"
          type="file"
          accept="image/*"
          onChange={(event) => onUpload(event.target.files?.[0] || null)}
        />
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="Preview do banner" className="admin-thumb admin-banner-preview" />
        ) : null}
        {uploading && <p className="muted">Enviando imagem…</p>}
      </div>

      <div className="admin-grid-2">
        <div className="form-field">
          <label htmlFor="title">Título em cima da foto</label>
          <input
            id="title"
            name="title"
            defaultValue={slide?.title || ""}
            required
            placeholder="Todas as suculentas e cactos"
          />
        </div>
        <div className="form-field">
          <label htmlFor="kicker">Texto pequeno (opcional)</label>
          <input id="kicker" name="kicker" defaultValue={slide?.kicker || ""} placeholder="Opcional" />
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="form-field">
          <label htmlFor="ctaLabel">Texto do botão</label>
          <input id="ctaLabel" name="ctaLabel" defaultValue={slide?.ctaLabel || "Ver produtos"} />
        </div>
        <div className="form-field">
          <label htmlFor="ctaHref">Link do botão</label>
          <input id="ctaHref" name="ctaHref" defaultValue={slide?.ctaHref || "/produtos"} placeholder="/produtos" />
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="form-field">
          <label htmlFor="order">Ordem (1 = primeiro na home)</label>
          <input id="order" name="order" type="number" defaultValue={slide?.order ?? 1} />
        </div>
        <div className="form-field">
          <label htmlFor="alt">Texto da imagem</label>
          <input id="alt" name="alt" defaultValue={slide?.alt || ""} placeholder="Suculentas" />
        </div>
      </div>

      <label className="check-row">
        <input name="badges" type="checkbox" defaultChecked={slide?.badges} />
        Mostrar selos “Melhor qualidade / Melhor preço”
      </label>
      <label className="check-row">
        <input name="active" type="checkbox" defaultChecked={slide?.active ?? true} />
        Mostrar este banner na home
      </label>

      {state.error && <p className="form-error">{state.error}</p>}
      <button type="submit" className="btn-buy" disabled={pending || uploading || !image}>
        {pending ? "Salvando…" : "Salvar e ver na home"}
      </button>
    </form>
  );
}
