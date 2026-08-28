import { hasUsableDatabaseUrl, prisma } from "@/lib/prisma";

export type HeroSlideDTO = {
  id: number;
  kicker: string;
  title: string;
  cta: { href: string; label: string };
  image: string;
  alt: string;
  badges: boolean;
};

export const DEFAULT_HERO_SLIDES: HeroSlideDTO[] = [
  {
    id: 0,
    kicker: "Grande variedade de",
    title: "suculentas",
    cta: { href: "/promocoes", label: "Comprar" },
    image:
      "https://images.unsplash.com/photo-1459156212016-c8128e64e80f?auto=format&fit=crop&w=1600&q=80",
    alt: "Suculentas",
    badges: true,
  },
  {
    id: 1,
    kicker: "Pedido fácil pelo",
    title: "WhatsApp",
    cta: { href: "/como-pedir", label: "Como pedir" },
    image:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1600&q=80",
    alt: "Mudas",
    badges: false,
  },
  {
    id: 2,
    kicker: "Fotos reais das",
    title: "mudas",
    cta: { href: "/produtos", label: "Ver produtos" },
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=80",
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
  return {
    id: slide.id,
    kicker: slide.kicker,
    title: slide.title,
    cta: { href: slide.ctaHref, label: slide.ctaLabel },
    image: slide.image,
    alt: slide.alt || slide.title,
    badges: slide.badges,
  };
}

export async function getHeroSlides(): Promise<HeroSlideDTO[]> {
  if (!hasUsableDatabaseUrl()) return DEFAULT_HERO_SLIDES;

  try {
    const rows = await prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    if (!rows.length) return DEFAULT_HERO_SLIDES;
    return rows.map(toHeroSlideDTO);
  } catch (error) {
    console.error("Hero slides query failed:", error);
    return DEFAULT_HERO_SLIDES;
  }
}
