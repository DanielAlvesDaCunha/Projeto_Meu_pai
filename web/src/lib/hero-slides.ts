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
export const HERO_SLIDE_COUNT = 3;

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
    id: -2,
    kicker: "Pedido fácil pelo",
    title: "WhatsApp",
    cta: { href: "/como-pedir", label: "Como pedir" },
    image: HERO_FALLBACK_IMAGE,
    alt: "Mudas",
    badges: false,
    photoBanner: true,
  },
  {
    id: -3,
    kicker: "Fotos reais das",
    title: "mudas",
    cta: { href: "/produtos", label: "Ver produtos" },
    image: HERO_FALLBACK_IMAGE,
    alt: "Variedades",
    badges: false,
    photoBanner: true,
  },
];

export function withSafeHeroImage(slide: HeroSlideDTO): HeroSlideDTO {
  const image = slide.image.trim();
  if (!image || image.includes("images.unsplash.com") || image.includes("via.placeholder")) {
    return { ...slide, image: HERO_FALLBACK_IMAGE };
  }
  return { ...slide, image };
}

/** Home carousel always shows exactly 3 photos. */
export function withThreeHeroSlides(slides: HeroSlideDTO[]): HeroSlideDTO[] {
  const taken = slides.slice(0, HERO_SLIDE_COUNT).map((slide) =>
    withSafeHeroImage({
      ...slide,
      photoBanner: true,
    }),
  );

  while (taken.length < HERO_SLIDE_COUNT) {
    const fallback = DEFAULT_HERO_SLIDES[taken.length] ?? CATALOG_HERO_SLIDE;
    taken.push(
      withSafeHeroImage({
        ...fallback,
        id: -100 - taken.length,
        photoBanner: true,
      }),
    );
  }

  return taken;
}

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
