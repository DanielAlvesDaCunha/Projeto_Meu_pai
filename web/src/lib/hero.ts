import { unstable_noStore as noStore } from "next/cache";
import { hasUsableDatabaseUrl, prisma } from "@/lib/prisma";
import { DEFAULT_HERO_SLIDES, toHeroSlideDTO, withThreeHeroSlides } from "@/lib/hero-slides";

export type { HeroSlideDTO } from "@/lib/hero-slides";
export {
  CATALOG_HERO_SLIDE,
  DEFAULT_HERO_SLIDES,
  HERO_FALLBACK_IMAGE,
  HERO_SLIDE_COUNT,
  toHeroSlideDTO,
  withSafeHeroImage,
  withThreeHeroSlides,
} from "@/lib/hero-slides";

export async function getHeroSlides() {
  noStore();

  if (hasUsableDatabaseUrl()) {
    try {
      const rows = await prisma.heroSlide.findMany({
        where: { active: true },
        orderBy: [{ order: "asc" }, { id: "asc" }],
      });
      if (rows.length) {
        return withThreeHeroSlides(rows.map((row) => toHeroSlideDTO(row)));
      }
    } catch (error) {
      console.error("Hero slides query failed:", error);
    }
  }

  return withThreeHeroSlides(DEFAULT_HERO_SLIDES);
}
