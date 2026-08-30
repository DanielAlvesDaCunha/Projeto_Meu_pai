"use client";

import { useRef } from "react";
import { StoreProductGrid } from "@/components/StoreProductGrid";
import type { ProductDTO } from "@/lib/money";

type Props = {
  products: ProductDTO[];
  emptyText?: string;
  defaultCategoryId?: number;
  defaultFeatured?: boolean;
};

export function ProductCarousel({
  products,
  emptyText,
  defaultCategoryId,
  defaultFeatured,
}: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  function scrollByPage(direction: number) {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div className="product-carousel">
      <button
        type="button"
        className="carousel-arrow is-prev"
        aria-label="Anterior"
        onClick={() => scrollByPage(-1)}
      >
        ‹
      </button>
      <div className="product-carousel-scroller" ref={scroller}>
        <StoreProductGrid
          className="product-carousel-row"
          products={products}
          emptyText={emptyText}
          defaultCategoryId={defaultCategoryId}
          defaultFeatured={defaultFeatured}
        />
      </div>
      <button
        type="button"
        className="carousel-arrow is-next"
        aria-label="Próximo"
        onClick={() => scrollByPage(1)}
      >
        ›
      </button>
    </div>
  );
}
