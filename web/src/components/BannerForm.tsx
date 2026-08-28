"use client";

import { useActionState, useState } from "react";
import { saveHeroSlide, type AdminFormState } from "@/lib/actions/admin";

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
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha no upload");
      setImage(data.url);
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

      <div className="admin-grid-2">
        <div className="form-field">
          <label htmlFor="kicker">Texto pequeno (acima do título)</label>
          <input id="kicker" name="kicker" defaultValue={slide?.kicker || ""} placeholder="Grande variedade de" />
        </div>
        <div className="form-field">
          <label htmlFor="title">Título grande</label>
          <input id="title" name="title" defaultValue={slide?.title || ""} required placeholder="suculentas" />
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
          <label htmlFor="order">Ordem</label>
          <input id="order" name="order" type="number" defaultValue={slide?.order ?? 0} />
        </div>
        <div className="form-field">
          <label htmlFor="alt">Texto alternativo da imagem</label>
          <input id="alt" name="alt" defaultValue={slide?.alt || ""} placeholder="Suculentas" />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="banner-photo">Imagem do banner</label>
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

      <label className="check-row">
        <input name="badges" type="checkbox" defaultChecked={slide?.badges} />
        Mostrar selos “Melhor qualidade / Melhor preço”
      </label>
      <label className="check-row">
        <input name="active" type="checkbox" defaultChecked={slide?.active ?? true} />
        Ativo na home
      </label>

      {state.error && <p className="form-error">{state.error}</p>}
      {state.ok && <p className="form-ok">Banner salvo!</p>}
      <button type="submit" className="btn-buy" disabled={pending || uploading}>
        {pending ? "Salvando…" : slide ? "Salvar banner" : "Criar banner"}
      </button>
    </form>
  );
}
