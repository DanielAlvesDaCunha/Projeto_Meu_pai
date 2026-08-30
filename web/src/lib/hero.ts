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

export const DEFAULT_HERO_SLIDES: HeroSlideDTO[] = [
  CATALOG_HERO_SLIDE,
  {
    id: 1,
    kicker: "Pedido fácil pelo",
    title: "WhatsApp",
    cta: { href: "/como-pedir", label: "Como pedir" },
    image: "/hero-suculentas.svg",
    alt: "Mudas",
    badges: false,
  },
  {
    id: 2,
    kicker: "Fotos reais das",
    title: "mudas",
    cta: { href: "/produtos", label: "Ver produtos" },
    image: "/hero-suculentas.svg",
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
    photoBanner: false,
  };
}

function isOldCatalogHero(slide: HeroSlideDTO) {
  const title = slide.title.toLowerCase();
  return title === "suculentas" || title.includes("todas as suculentas");
}

function withSafeHeroImage(slide: HeroSlideDTO): HeroSlideDTO {
  if (!slide.image || slide.image.includes("images.unsplash.com")) {
    return { ...slide, image: "/hero-suculentas.svg" };
  }
  return slide;
}

function assembleHeroSlides(slides: HeroSlideDTO[], catalog = CATALOG_HERO_SLIDE): HeroSlideDTO[] {
  const rest = slides
    .filter((slide) => !isOldCatalogHero(slide) && !slide.photoBanner)
    .slice(0, 2)
    .map(withSafeHeroImage);
  return [withSafeHeroImage(catalog), ...rest];
}

export async function getHeroSlides(): Promise<HeroSlideDTO[]> {
  const catalog = { ...CATALOG_HERO_SLIDE };

  if (hasUsableDatabaseUrl()) {
    try {
      const [rows, photo] = await Promise.all([
        prisma.heroSlide.findMany({
          where: { active: true },
          orderBy: [{ order: "asc" }, { id: "asc" }],
        }),
        prisma.product.findFirst({
          where: { available: true, image: { not: "" } },
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          select: { image: true },
        }),
      ]);
      if (photo?.image) catalog.image = photo.image;
      if (!rows.length) return assembleHeroSlides(DEFAULT_HERO_SLIDES, catalog);
      return assembleHeroSlides(rows.map(toHeroSlideDTO), catalog);
    } catch (error) {
      console.error("Hero slides query failed:", error);
    }
  }

  return assembleHeroSlides(DEFAULT_HERO_SLIDES, catalog);
}
