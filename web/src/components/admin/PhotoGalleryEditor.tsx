"use client";

import { useState } from "react";
import { uploadAdminImage } from "@/lib/uploadImage";

const MAX_PHOTOS = 4;

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
};

export function PhotoGalleryEditor({ images, onChange, disabled }: Props) {
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [error, setError] = useState("");
  const slots = Array.from({ length: MAX_PHOTOS }, (_, index) => images[index] || "");

  async function uploadFile(file: File, slot: number) {
    setUploadingSlot(slot);
    setError("");
    try {
      const url = await uploadAdminImage(file);
      const next = [...images];
      next[slot] = url;
      onChange(next.filter(Boolean).slice(0, MAX_PHOTOS));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Erro no upload");
    } finally {
      setUploadingSlot(null);
    }
  }

  function removeAt(slot: number) {
    const next = slots.filter((_, index) => index !== slot);
    onChange(next);
  }

  function setPrimary(slot: number) {
    if (!slots[slot]) return;
    const next = [slots[slot], ...slots.filter((_, index) => index !== slot)];
    onChange(next.filter(Boolean));
  }

  return (
    <div className="photo-gallery-editor">
      <p className="photo-gallery-hint">Até 4 fotos por anúncio. A primeira é a capa na vitrine.</p>
      <div className="photo-gallery-grid">
        {slots.map((url, slot) => (
          <div key={slot} className={`photo-slot${url ? " has-image" : ""}`}>
            {url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Foto ${slot + 1}`} />
                <div className="photo-slot-actions">
                  {slot > 0 ? (
                    <button type="button" onClick={() => setPrimary(slot)} disabled={disabled}>
                      Capa
                    </button>
                  ) : (
                    <span className="photo-slot-badge">Capa</span>
                  )}
                  <button type="button" onClick={() => removeAt(slot)} disabled={disabled}>
                    Remover
                  </button>
                </div>
              </>
            ) : (
              <label className="photo-slot-empty">
                <span>{uploadingSlot === slot ? "Enviando…" : `Toque para foto ${slot + 1}`}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={disabled || uploadingSlot !== null}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadFile(file, slot);
                    event.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
        ))}
      </div>
      {error ? <p className="form-error photo-gallery-error">{error}</p> : null}
    </div>
  );
}

export function imagesToGalleryText(images: string[]) {
  return images.slice(1).join("\n");
}

export function galleryTextToImages(mainImage: string, galleryText: string) {
  const extras = galleryText
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
  return [mainImage, ...extras].filter(Boolean).slice(0, MAX_PHOTOS);
}
