"use client";

import { useState } from "react";
import { adjustProductStock, updateProductStock } from "@/lib/actions/admin";

export function StockQuickEdit({ productId, stock }: { productId: number; stock: number }) {
  const [value, setValue] = useState(String(stock));
  const [pending, setPending] = useState(false);

  async function save(nextStock = Number(value)) {
    if (!Number.isFinite(nextStock)) return;
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("id", String(productId));
      formData.set("stock", String(nextStock));
      await updateProductStock(formData);
      setValue(String(Math.max(0, Math.floor(nextStock))));
    } finally {
      setPending(false);
    }
  }

  async function changeBy(delta: number) {
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("id", String(productId));
      formData.set("delta", String(delta));
      await adjustProductStock(formData);
      setValue((current) => String(Math.max(0, Number(current) + delta)));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="stock-quick">
      <button type="button" onClick={() => void changeBy(-1)} disabled={pending || Number(value) <= 0} aria-label="Diminuir estoque">
        −
      </button>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <input
          type="number"
          min={0}
          max={9999}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="Estoque"
        />
      </form>
      <button type="button" onClick={() => void changeBy(1)} disabled={pending} aria-label="Aumentar estoque">
        +
      </button>
      <button type="button" className="stock-quick-save" onClick={() => void save()} disabled={pending}>
        {pending ? "…" : "OK"}
      </button>
    </div>
  );
}
