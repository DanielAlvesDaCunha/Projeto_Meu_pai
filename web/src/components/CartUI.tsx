"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/money";

export function CartDrawer() {
  const {
    items,
    subtotal,
    pixTotal,
    drawerOpen,
    closeDrawer,
    setQty,
  } = useCart();

  if (!drawerOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={closeDrawer} />
      <aside className="cart-drawer" aria-label="Seu pedido">
        <header>
          <h2>Seu pedido</h2>
          <button type="button" className="cart-remove" onClick={closeDrawer} aria-label="Fechar">
            ×
          </button>
        </header>
        <div className="body">
          {!items.length ? (
            <p className="muted text-center">O pedido está vazio. Toque em Comprar no catálogo.</p>
          ) : (
            items.map((item) => (
              <div className="cart-line" key={item.id}>
                <div>
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" />
                  ) : (
                    <div className="no-photo" style={{ width: 64, height: 64 }}>?</div>
                  )}
                </div>
                <div>
                  <strong>{item.name}</strong>
                  <div className="muted" style={{ fontSize: "0.78rem", margin: "0.2rem 0 0.45rem" }}>
                    {money(item.price)} · {money(item.price * item.qty)}
                  </div>
                  <div className="qty-control">
                    <button type="button" onClick={() => setQty(item.id, item.qty - 1)}>
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={item.qty}
                      onChange={(e) => setQty(item.id, Number(e.target.value))}
                    />
                    <button type="button" onClick={() => setQty(item.id, item.qty + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <button type="button" className="cart-remove" onClick={() => setQty(item.id, 0)}>
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="summary">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span>Pix (−3%)</span>
              <strong>{money(pixTotal)}</strong>
            </div>
            <Link className="btn-buy" href="/pedido" onClick={closeDrawer}>
              Finalizar no WhatsApp
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

export function CartToast() {
  const { toast } = useCart();
  if (!toast) return null;
  return <div className="cart-toast">{toast}</div>;
}

export function CartButton() {
  const { count, openDrawer } = useCart();
  return (
    <button type="button" className="cart-toggle" onClick={openDrawer} aria-label="Pedido">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 14h9.5c.8 0 1.5-.5 1.7-1.2L21 5H6.2L5.3 2H1v2h2.4l3.6 8.6-.9 1.6c-.4.8.2 1.8 1.1 1.8z"
        />
      </svg>
      {count > 0 && <span className="cart-badge">{count}</span>}
    </button>
  );
}
