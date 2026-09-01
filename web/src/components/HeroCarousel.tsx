"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent, type TransitionEvent } from "react";
import { ChevronIcon } from "@/components/ChevronIcon";
import { HERO_FALLBACK_IMAGE, withThreeHeroSlides, type HeroSlideDTO } from "@/lib/hero-slides";

const AUTO_MS = 5500;

export function HeroCarousel({ slides }: { slides: HeroSlideDTO[] }) {
  const items = useMemo(() => withThreeHeroSlides(slides), [slides]);
  const count = items.length;
  const loop = count > 1;
  const trackItems = useMemo(
    () => (loop ? [items[count - 1], ...items, items[0]] : items),
    [items, count, loop],
  );

  const [pos, setPos] = useState(loop ? 1 : 0);
  const [animating, setAnimating] = useState(false);
  const busy = useRef(false);
  const paused = useRef(false);
  const startX = useRef(0);
  const posRef = useRef(pos);
  posRef.current = pos;

  const realIndex = loop ? (pos === 0 ? count - 1 : pos === count + 1 ? 0 : pos - 1) : 0;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!loop || busy.current) return;
      busy.current = true;
      setAnimating(true);
      setPos((current) => current + dir);
    },
    [loop],
  );

  const goTo = useCallback(
    (target: number) => {
      if (!loop || busy.current) return;
      const currentReal = posRef.current === 0 ? count - 1 : posRef.current === count + 1 ? 0 : posRef.current - 1;
      if (target === currentReal) return;
      busy.current = true;
      setAnimating(true);
      if (currentReal === count - 1 && target === 0) {
        setPos(count + 1);
        return;
      }
      if (currentReal === 0 && target === count - 1) {
        setPos(0);
        return;
      }
      setPos(target + 1);
    },
    [loop, count],
  );

  function onTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;
    if (!loop) return;

    const current = posRef.current;
    if (current === 0) {
      setAnimating(false);
      setPos(count);
      return;
    }
    if (current === count + 1) {
      setAnimating(false);
      setPos(1);
      return;
    }
    busy.current = false;
  }

  useEffect(() => {
    if (!animating) busy.current = false;
  }, [animating, pos]);

  useEffect(() => {
    if (!loop) return;
    const id = window.setInterval(() => {
      if (!paused.current) go(1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [loop, go]);

  if (!items.length) return null;

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    startX.current = event.touches[0]?.clientX ?? 0;
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const x = event.changedTouches[0]?.clientX ?? startX.current;
    const dx = x - startX.current;
    if (Math.abs(dx) < 48) return;
    go(dx < 0 ? 1 : -1);
  }

  return (
    <section className="hero-est" aria-roledescription="carousel" aria-label="Destaques">
      <div
        className="hero-carousel"
        onMouseEnter={() => {
          paused.current = true;
        }}
        onMouseLeave={() => {
          paused.current = false;
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={`hero-track${animating ? " is-animating" : ""}`}
          style={{ transform: `translate3d(-${pos * 100}%, 0, 0)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {trackItems.map((slide, i) => {
            const visible = i === pos;
            return (
              <div
                key={`${slide.id}-${slide.title}-${i}`}
                className={`hero-slide${visible ? " is-active" : ""} is-photo`}
                aria-hidden={!visible}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hero-plants"
                  src={slide.image || HERO_FALLBACK_IMAGE}
                  alt={visible ? slide.alt || "" : ""}
                  draggable={false}
                  onError={(event) => {
                    if (event.currentTarget.src.includes(HERO_FALLBACK_IMAGE)) return;
                    event.currentTarget.src = HERO_FALLBACK_IMAGE;
                  }}
                />
                {slide.photoBanner ? (
                  <Link className="hero-photo-link" href={slide.cta.href} tabIndex={visible ? 0 : -1}>
                    <span className="hero-photo-label">{slide.title}</span>
                  </Link>
                ) : (
                  <>
                    <div className="hero-copy">
                      <p className="hero-kicker">{slide.kicker}</p>
                      <h1>{slide.title}</h1>
                      <Link className="btn-buy hero-cta" href={slide.cta.href} tabIndex={visible ? 0 : -1}>
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
            );
          })}
        </div>

        {loop ? (
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
                  aria-selected={i === realIndex}
                  className={i === realIndex ? "is-active" : undefined}
                  onClick={() => goTo(i)}
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
