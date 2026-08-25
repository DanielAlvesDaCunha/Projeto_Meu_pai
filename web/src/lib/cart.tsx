"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  sku: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  pixTotal: number;
  drawerOpen: boolean;
  toast: string;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  buildWhatsAppMessage: (customer?: {
    name?: string;
    city?: string;
    note?: string;
  }) => string;
  whatsappUrl: (customer?: {
    name?: string;
    city?: string;
    note?: string;
  }) => string;
};

const STORAGE_KEY = "paulo_suculentas_cart_v1";
const PIX_DISCOUNT = 0.97;

function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  storeName,
  whatsappNumber,
}: {
  children: ReactNode;
  storeName: string;
  whatsappNumber: string;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setItems(readStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }, []);

  const addItem = useCallback(
    (product: Omit<CartItem, "qty">, qty = 1) => {
      const amount = Math.max(1, Math.min(99, Number(qty) || 1));
      setItems((prev) => {
        const existing = prev.find((i) => i.id === String(product.id));
        if (existing) {
          return prev.map((i) =>
            i.id === String(product.id)
              ? { ...i, qty: Math.min(99, i.qty + amount) }
              : i
          );
        }
        return [
          ...prev,
          {
            id: String(product.id),
            name: product.name,
            price: Number(product.price),
            image: product.image || "",
            sku: product.sku || "",
            qty: amount,
          },
        ];
      });
      showToast(`${product.name} adicionado ao pedido`);
      setDrawerOpen(true);
    },
    [showToast]
  );

  const setQty = useCallback((id: string, qty: number) => {
    const amount = Math.max(0, Math.min(99, Number(qty) || 0));
    setItems((prev) => {
      if (amount <= 0) return prev.filter((i) => i.id !== String(id));
      return prev.map((i) => (i.id === String(id) ? { ...i, qty: amount } : i));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const pixTotal = subtotal * PIX_DISCOUNT;

  const buildWhatsAppMessage = useCallback(
    (customer: { name?: string; city?: string; note?: string } = {}) => {
      const lines = [
        `Olá! Quero fazer um pedido no *${storeName}*:`,
        "",
        ...items.map((item) => {
          const lineTotal = item.price * item.qty;
          const sku = item.sku ? ` (${item.sku})` : "";
          return `• ${item.name}${sku} — ${item.qty}x ${money(item.price)} = ${money(lineTotal)}`;
        }),
        "",
        `*Subtotal:* ${money(subtotal)}`,
        `*Pix (3% off):* ${money(pixTotal)}`,
      ];
      if (customer.name) lines.push(`*Nome:* ${customer.name}`);
      if (customer.city) lines.push(`*Cidade:* ${customer.city}`);
      if (customer.note) lines.push(`*Observações:* ${customer.note}`);
      lines.push("", "Pode confirmar disponibilidade, frete e forma de pagamento?");
      return lines.join("\n");
    },
    [items, pixTotal, storeName, subtotal]
  );

  const whatsappUrl = useCallback(
    (customer?: { name?: string; city?: string; note?: string }) => {
      const text = encodeURIComponent(buildWhatsAppMessage(customer));
      return `https://wa.me/${whatsappNumber}?text=${text}`;
    },
    [buildWhatsAppMessage, whatsappNumber]
  );

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    pixTotal,
    drawerOpen,
    toast,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    addItem,
    setQty,
    clear,
    buildWhatsAppMessage,
    whatsappUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
