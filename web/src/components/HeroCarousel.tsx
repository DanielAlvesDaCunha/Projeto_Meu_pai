"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    kicker: "Grande variedade de",
    title: "suculentas",
    cta: { href: "/promocoes", label: "Comprar" },
    image:
      "https://images.unsplash.com/photo-1459156212016-c8128e64e80f?auto=format&fit=crop&w=1600&q=80",
    alt: "Suculentas",
    badges: true,
  },
  {
    kicker: "Pedido fácil pelo",
    title: "WhatsApp",
    cta: { href: "/como-pedir", label: "Como pedir" },
    image:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1600&q=80",
    alt: "Mudas",
    badges: false,
  },
  {
    kicker: "Fotos reais das",
    title: "mudas",
    cta: { href: "/produtos", label: "Ver produtos" },
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=80",
    alt: "Variedades",
    badges: false,
  },
] as const;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, []);

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  };

  return (
    <section className="hero-est" aria-roledescription="carousel" aria-label="Destaques">
      <div className="hero-carousel">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.title}
            className={`hero-slide${i === index ? " is-active" : ""}`}
            aria-hidden={i !== index}
          >
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-plants" src={slide.image} alt={slide.alt} />
          </div>
        ))}

        <button type="button" className="hero-nav hero-nav-prev" onClick={() => go(-1)} aria-label="Anterior">
          ‹
        </button>
        <button type="button" className="hero-nav hero-nav-next" onClick={() => go(1)} aria-label="Próximo">
          ›
        </button>

        <div className="hero-dots" role="tablist" aria-label="Slides">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={i === index ? "is-active" : undefined}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
