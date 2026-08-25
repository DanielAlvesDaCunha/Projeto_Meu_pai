"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/money";

export default function PedidoPage() {
  const { items, subtotal, pixTotal, whatsappUrl } = useCart();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    window.open(whatsappUrl({ name, city, note }), "_blank", "noopener");
  };

  return (
    <section className="container section">
      <div className="section-title">
        <h1>Meu pedido</h1>
      </div>

      {!items.length ? (
        <div className="text-center">
          <p className="muted">Seu pedido está vazio.</p>
          <Link className="btn-buy" style={{ maxWidth: 220, display: "inline-block" }} href="/">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="checkout-grid">
          <div className="checkout-panel">
            <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Seu pedido</h2>
            {items.map((item) => (
              <div className="checkout-line" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <div className="muted" style={{ fontSize: "0.85rem" }}>
                    {item.qty} × {money(item.price)}
                  </div>
                </div>
                <strong>{money(item.price * item.qty)}</strong>
              </div>
            ))}
            <div className="checkout-totals">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span>Pix (−3%)</span>
                <strong>{money(pixTotal)}</strong>
              </div>
            </div>
          </div>

          <form className="checkout-panel" onSubmit={onSubmit}>
            <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Dados para o WhatsApp</h2>
            <div className="form-field">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="city">Cidade</label>
              <input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="note">Observações</label>
              <textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <button type="submit" className="btn-buy">
              Enviar pedido no WhatsApp
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
