"use client";

import { useState } from "react";
import { updateProductStock } from "@/lib/actions/admin";

export function StockQuickEdit({ productId, stock }: { productId: number; stock: number }) {
  const [value, setValue] = useState(String(stock));
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    try {
      const fd = new FormData();
      fd.set("id", String(productId));
      fd.set("stock", value);
      await updateProductStock(fd);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="stock-quick"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <input
        type="number"
        min={0}
        max={9999}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Estoque"
      />
      <button type="submit" disabled={pending}>
        {pending ? "…" : "OK"}
      </button>
    </form>
  );
}
