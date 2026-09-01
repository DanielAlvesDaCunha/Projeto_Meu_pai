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

export const HERO_FALLBACK_IMAGE = "/hero-suculentas.svg";

export const CATALOG_HERO_SLIDE: HeroSlideDTO = {
  id: -1,
  kicker: "",
  title: "Todas as suculentas e cactos",
  cta: { href: "/produtos", label: "Ver catálogo" },
  image: HERO_FALLBACK_IMAGE,
  alt: "Todas as suculentas e cactos",
  badges: false,
  photoBanner: true,
};

export const DEFAULT_HERO_SLIDES: HeroSlideDTO[] = [
  CATALOG_HERO_SLIDE,
  {
    id: 1,
    kicker: "Pedido fácil pelo",
    title: "WhatsApp",
    cta: { href: "/como-pedir", label: "Como pedir" },
    image: HERO_FALLBACK_IMAGE,
    alt: "Mudas",
    badges: false,
  },
  {
    id: 2,
    kicker: "Fotos reais das",
    title: "mudas",
    cta: { href: "/produtos", label: "Ver produtos" },
    image: HERO_FALLBACK_IMAGE,
    alt: "Variedades",
    badges: false,
  },
];

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
  const kicker = slide.kicker.trim();
  return {
    id: slide.id,
    kicker,
    title: slide.title,
    cta: { href: slide.ctaHref, label: slide.ctaLabel },
    image: slide.image.trim(),
    alt: slide.alt || slide.title,
    badges: slide.badges,
    photoBanner: true,
  };
}

export function withSafeHeroImage(slide: HeroSlideDTO): HeroSlideDTO {
  const image = slide.image.trim();
  if (!image || image.includes("images.unsplash.com") || image.includes("via.placeholder")) {
    return { ...slide, image: HERO_FALLBACK_IMAGE };
  }
  return { ...slide, image };
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
        return rows.map((row) => withSafeHeroImage(toHeroSlideDTO(row)));
      }
    } catch (error) {
      console.error("Hero slides query failed:", error);
    }
  }

  return DEFAULT_HERO_SLIDES;
}
