"use client";

import Link from "next/link";
import { FormEvent, useActionState, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/money";
import { createOrderFromCart, type CheckoutState } from "@/lib/actions/orders";

const initial: CheckoutState = {};

export default function PedidoPage() {
  const { data: session, status } = useSession();
  const { items, subtotal, pixTotal, whatsappUrl, clear } = useCart();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [note, setNote] = useState("");
  const [state, action, pending] = useActionState(createOrderFromCart, initial);

  useEffect(() => {
    if (session?.user?.name && !name) setName(session.user.name);
  }, [session, name]);

  const cartJson = useMemo(
    () =>
      JSON.stringify(
        items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          image: i.image,
          sku: i.sku,
          qty: i.qty,
        }))
      ),
    [items]
  );

  const onWhatsAppOnly = (e: FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    window.open(whatsappUrl({ name, city, note }), "_blank", "noopener");
  };

  if (status === "loading") {
    return (
      <section className="container section">
        <p className="muted text-center">Carregando…</p>
      </section>
    );
  }

  if (!session?.user) {
    return (
      <section className="container section">
        <div className="section-title">
          <h1>Meu pedido</h1>
        </div>
        <div className="text-center">
          <p className="muted">Entre na sua conta para registrar o pedido e pagar online.</p>
          <Link
            className="btn-buy"
            style={{ maxWidth: 260, display: "inline-block" }}
            href={`/entrar?callbackUrl=${encodeURIComponent("/pedido")}`}
          >
            Entrar / criar conta
          </Link>
        </div>
      </section>
    );
  }

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

          <div className="checkout-panel">
            <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Finalizar</h2>
            <div className="form-field">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="phone">WhatsApp</label>
              <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="city">Cidade</label>
              <input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="document">CPF (para Pix)</label>
              <input
                id="document"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="form-field">
              <label htmlFor="note">Observações</label>
              <textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            {state.error && <p className="form-error">{state.error}</p>}

            <form action={action}>
              <input type="hidden" name="cartJson" value={cartJson} />
              <input type="hidden" name="name" value={name} />
              <input type="hidden" name="phone" value={phone} />
              <input type="hidden" name="city" value={city} />
              <input type="hidden" name="document" value={document} />
              <input type="hidden" name="note" value={note} />
              <input type="hidden" name="paymentMethod" value="PIX" />
              <button
                type="submit"
                className="btn-buy"
                disabled={pending || !name}
                onClick={() => {
                  setTimeout(() => clear(), 800);
                }}
              >
                {pending ? "Criando pedido…" : "Pagar com Pix (Pagar.me)"}
              </button>
            </form>

            <form onSubmit={onWhatsAppOnly} style={{ marginTop: 12 }}>
              <input type="hidden" name="cartJson" value={cartJson} />
              <button type="submit" className="btn-filter">
                Só enviar no WhatsApp
              </button>
            </form>

            <form action={action} style={{ marginTop: 8 }}>
              <input type="hidden" name="cartJson" value={cartJson} />
              <input type="hidden" name="name" value={name} />
              <input type="hidden" name="phone" value={phone} />
              <input type="hidden" name="city" value={city} />
              <input type="hidden" name="document" value={document} />
              <input type="hidden" name="note" value={note} />
              <input type="hidden" name="paymentMethod" value="WHATSAPP" />
              <button
                type="submit"
                className="section-more"
                disabled={pending || !name}
                onClick={() => setTimeout(() => clear(), 800)}
              >
                Registrar pedido e abrir WhatsApp depois
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
