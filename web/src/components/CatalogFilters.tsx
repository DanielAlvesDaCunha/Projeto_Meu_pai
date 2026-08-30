"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { SortSelect } from "@/components/SortSelect";

export type CatalogFilterType = {
  href: string;
  label: string;
  active?: boolean;
  soon?: boolean;
};

export function CatalogFilters({
  types,
  sort,
  de,
  ate,
  q,
  priceHints,
}: {
  types: CatalogFilterType[];
  sort: string;
  de?: string;
  ate?: string;
  q?: string;
  priceHints?: { min: string; max: string };
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const hasPrice = Boolean(de || ate);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.classList.add("filters-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("filters-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="mobile-filter-bar">
        <button
          type="button"
          className="mobile-filter-btn"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <span>Filtrar{hasPrice ? " · preço" : ""}</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path
              fill="currentColor"
              d="M4 5h16l-6.2 7.4V19l-3.6 1.8V12.4L4 5z"
            />
          </svg>
        </button>
        <SortSelect compact defaultValue={sort} de={de} ate={ate} q={q} />
      </div>

      {open ? (
        <div className="mobile-filter-overlay">
          <button
            type="button"
            className="mobile-filter-backdrop"
            aria-label="Fechar filtros"
            onClick={() => setOpen(false)}
          />
          <div className="mobile-filter-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="mobile-filter-sheet-head">
              <strong id={titleId}>Filtrar</strong>
              <button type="button" className="mobile-filter-close" onClick={() => setOpen(false)} aria-label="Fechar">
                ×
              </button>
            </div>

            <div className="mobile-filter-sheet-grid">
              <div>
                <p className="mobile-filter-kicker">Tipos</p>
                <ul className="filter-cats">
                  {types.map((type) => (
                    <li key={type.href}>
                      <Link
                        href={type.href}
                        className={type.active ? "is-active" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {type.label}
                        {type.soon ? <span className="cat-soon-tag">Em breve</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mobile-filter-kicker">Valor</p>
                <form method="get" className="price-filter-form" onSubmit={() => setOpen(false)}>
                  {sort !== "mais-novo" ? <input type="hidden" name="ordenar" value={sort} /> : null}
                  {q ? <input type="hidden" name="q" value={q} /> : null}
                  <div className="price-inputs mobile-price-inputs">
                    <label>
                      <span className="muted">De</span>
                      <input
                        type="number"
                        name="de"
                        step="0.01"
                        min="0"
                        placeholder={priceHints?.min || "0"}
                        defaultValue={de || ""}
                      />
                    </label>
                    <label>
                      <span className="muted">Até</span>
                      <input
                        type="number"
                        name="ate"
                        step="0.01"
                        min="0"
                        placeholder={priceHints?.max || "100"}
                        defaultValue={ate || ""}
                      />
                    </label>
                    <button type="submit" className="btn-price-go" aria-label="Aplicar preço">
                      →
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
