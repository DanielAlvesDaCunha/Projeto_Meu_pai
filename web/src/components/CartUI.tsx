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

export function CartButton({ variant = "icon" }: { variant?: "icon" | "utility" }) {
  const { count, openDrawer } = useCart();
  const cls = variant === "utility" ? "cart-toggle cart-toggle-utility" : "cart-toggle";

  return (
    <button type="button" className={cls} onClick={openDrawer} aria-label="Meu carrinho">
      {/* Cesta (não o carrinho clássico da referência) */}
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M4.5 9.5h15l-1.2 9.2a2 2 0 0 1-2 1.8H7.7a2 2 0 0 1-2-1.8L4.5 9.5z" strokeLinejoin="round" />
        <path d="M8.5 9.5V7a3.5 3.5 0 0 1 7 0v2.5" strokeLinecap="round" />
      </svg>
      {variant === "utility" && <span>Meu carrinho</span>}
      <span className="cart-badge">{count}</span>
    </button>
  );
}
