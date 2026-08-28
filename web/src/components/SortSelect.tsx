"use client";

const OPTIONS = [
  { value: "mais-novo", label: "Mais novo ao mais antigo" },
  { value: "mais-antigo", label: "Mais antigo ao mais novo" },
  { value: "menor-preco", label: "Preço: menor ao maior" },
  { value: "maior-preco", label: "Preço: maior ao menor" },
  { value: "a-z", label: "A — Z" },
  { value: "z-a", label: "Z — A" },
] as const;

export function SortSelect({
  defaultValue,
  de,
  ate,
  q,
}: {
  defaultValue: string;
  de?: string;
  ate?: string;
  q?: string;
}) {
  const value = OPTIONS.some((o) => o.value === defaultValue) ? defaultValue : "mais-novo";

  return (
    <form className="sort-form sort-form-pill" method="get">
      {de ? <input type="hidden" name="de" value={de} /> : null}
      {ate ? <input type="hidden" name="ate" value={ate} /> : null}
      {q ? <input type="hidden" name="q" value={q} /> : null}
      <label htmlFor="ordenar" className="sr-only">
        Ordenar
      </label>
      <select
        id="ordenar"
        name="ordenar"
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.submit()}
        aria-label="Ordenar produtos"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="sort-icon" aria-hidden>
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M8 7h3V4h2v3h3l-4 4-4-4zm8 10h-3v3h-2v-3H8l4-4 4 4z" />
        </svg>
      </span>
    </form>
  );
}
