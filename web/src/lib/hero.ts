import { unstable_noStore as noStore } from "next/cache";
import { hasUsableDatabaseUrl, prisma } from "@/lib/prisma";

export type HeroSlideDTO = {
  id: number;
  kicker: string;
  title: string;
  cta: { href: string; label: string };
  image: string;
  alt: string;
  badges: boolean;
  photoBanner?: boolean;
};

export const CATALOG_HERO_SLIDE: HeroSlideDTO = {
  id: -1,
  kicker: "",
  title: "Todas as suculentas e cactos",
  cta: { href: "/produtos", label: "Ver catálogo" },
  image: "/hero-suculentas.svg",
  alt: "Todas as suculentas e cactos",
  badges: false,
  photoBanner: true,
};

export const DEFAULT_HERO_SLIDES: HeroSlideDTO[] = [CATALOG_HERO_SLIDE];

export function toHeroSlideDTO(slide: {
  id: number;
  kicker: string;
  title: string;
  ctaHref: string;
  ctaLabel: string;
  image: string;
  alt: string;
  badges: boolean;
}): HeroSlideDTO {
  const image = slide.image.trim();
  return {
    id: slide.id,
    kicker: slide.kicker.trim(),
    title: slide.title,
    cta: { href: slide.ctaHref, label: slide.ctaLabel },
    image,
    alt: slide.alt || slide.title,
    badges: slide.badges,
    photoBanner: true,
  };
}

export async function getHeroSlides(): Promise<HeroSlideDTO[]> {
  noStore();

  if (hasUsableDatabaseUrl()) {
    try {
      const rows = await prisma.heroSlide.findMany({
        where: { active: true },
        orderBy: [{ order: "asc" }, { id: "asc" }],
      });
      if (rows.length) {
        const slides = rows.map(toHeroSlideDTO).filter((slide) => Boolean(slide.image));
        if (slides.length) return slides;
      }
    } catch (error) {
      console.error("Hero slides query failed:", error);
    }
  }

  return DEFAULT_HERO_SLIDES;
}
