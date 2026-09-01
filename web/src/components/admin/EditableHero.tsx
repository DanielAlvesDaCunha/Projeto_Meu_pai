"use client";

import Link from "next/link";
import { useAdminEdit } from "@/components/admin/AdminEditContext";
import { HeroCarousel } from "@/components/HeroCarousel";
import type { HeroSlideDTO } from "@/lib/hero";

export function EditableHero({ slides }: { slides: HeroSlideDTO[] }) {
  const { editMode } = useAdminEdit();
  const firstId = slides.find((slide) => slide.id > 0)?.id;
  const href = firstId ? `/admin/banners/${firstId}` : "/admin/banners";
  const carouselKey = slides.map((slide) => `${slide.id}:${slide.image}:${slide.title}`).join("|");

  return (
    <div className={`editable-hero${editMode ? " is-editing" : ""}`}>
      <HeroCarousel key={carouselKey} slides={slides} />
      {editMode ? (
        <Link className="editable-hero-btn" href={href}>
          Editar banner da home
        </Link>
      ) : null}
    </div>
  );
}
