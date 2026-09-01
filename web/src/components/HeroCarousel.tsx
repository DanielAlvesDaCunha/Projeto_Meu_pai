"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronIcon } from "@/components/ChevronIcon";
import type { HeroSlideDTO } from "@/lib/hero";

export function HeroCarousel({ slides }: { slides: HeroSlideDTO[] }) {
  const [index, setIndex] = useState(0);
  const items = slides.length ? slides : [];

  useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + items.length) % items.length);
  };

  return (
    <section className="hero-est" aria-roledescription="carousel" aria-label="Destaques">
      <div className="hero-carousel">
        {items.map((slide, i) => (
          <div
            key={`${slide.id}-${slide.title}`}
            className={`hero-slide${i === index ? " is-active" : ""} is-photo`}
            aria-hidden={i !== index}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-plants" src={slide.image} alt={slide.alt} />
            {slide.photoBanner ? (
              <Link className="hero-photo-link" href={slide.cta.href}>
                <span className="hero-photo-label">{slide.title}</span>
              </Link>
            ) : (
              <>
                <div className="hero-copy">
                  <p className="hero-kicker">{slide.kicker}</p>
                  <h1>{slide.title}</h1>
                  <Link className="btn-buy hero-cta" href={slide.cta.href}>
                    {slide.cta.label}
                  </Link>
                </div>
                {slide.badges && (
                  <div className="hero-badges">
                    <div>
                      <strong>Melhor qualidade</strong>
                    </div>
                    <div>
                      <strong>Melhor preço</strong>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {items.length > 1 ? (
          <>
            <button type="button" className="hero-nav hero-nav-prev" onClick={() => go(-1)} aria-label="Anterior">
              <ChevronIcon dir="prev" />
            </button>
            <button type="button" className="hero-nav hero-nav-next" onClick={() => go(1)} aria-label="Próximo">
              <ChevronIcon dir="next" />
            </button>
            <div className="hero-dots" role="tablist" aria-label="Slides">
              {items.map((slide, i) => (
                <button
                  key={`dot-${slide.id}`}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  className={i === index ? "is-active" : undefined}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
