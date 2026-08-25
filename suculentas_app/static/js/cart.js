(() => {
  const STORAGE_KEY = "paulo_suculentas_cart_v1";
  const PIX_DISCOUNT = 0.97;

  const cfg = () => window.STORE_CONFIG || {};

  const money = (value) =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const readCart = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const writeCart = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    render();
  };

  const countItems = (items) =>
    items.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  const subtotal = (items) =>
    items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);

  const addItem = (product, qty = 1) => {
    const amount = Math.max(1, Math.min(99, Number(qty) || 1));
    const items = readCart();
    const existing = items.find((item) => String(item.id) === String(product.id));
    if (existing) {
      existing.qty = Math.min(99, existing.qty + amount);
    } else {
      items.push({
        id: String(product.id),
        name: product.name,
        price: Number(product.price),
        image: product.image || "",
        sku: product.sku || "",
        qty: amount,
      });
    }
    writeCart(items);
    showToast(`${product.name} adicionado ao pedido`);
  };

  const setQty = (id, qty) => {
    const amount = Math.max(0, Math.min(99, Number(qty) || 0));
    let items = readCart();
    if (amount <= 0) {
      items = items.filter((item) => String(item.id) !== String(id));
    } else {
      items = items.map((item) =>
        String(item.id) === String(id) ? { ...item, qty: amount } : item
      );
    }
    writeCart(items);
  };

  const clearCart = () => writeCart([]);

  const buildWhatsAppMessage = (customer = {}) => {
    const items = readCart();
    const store = cfg().storeName || "Cantinho das Suculentas";
    const total = subtotal(items);
    const pix = total * PIX_DISCOUNT;

    const lines = [
      `Olá! Quero fazer um pedido no *${store}*:`,
      "",
      ...items.map((item) => {
        const lineTotal = Number(item.price) * Number(item.qty);
        const sku = item.sku ? ` (${item.sku})` : "";
        return `• ${item.name}${sku} — ${item.qty}x ${money(item.price)} = ${money(lineTotal)}`;
      }),
      "",
      `*Subtotal:* ${money(total)}`,
      `*Pix (3% off):* ${money(pix)}`,
    ];

    if (customer.name) lines.push(`*Nome:* ${customer.name}`);
    if (customer.city) lines.push(`*Cidade:* ${customer.city}`);
    if (customer.note) lines.push(`*Observações:* ${customer.note}`);

    lines.push("", "Pode confirmar disponibilidade, frete e forma de pagamento?");
    return lines.join("\n");
  };

  const whatsappUrl = (customer = {}) => {
    const number = cfg().whatsappNumber || "";
    const text = encodeURIComponent(buildWhatsAppMessage(customer));
    return `https://wa.me/${number}?text=${text}`;
  };

  const showToast = (message) => {
    let el = document.getElementById("cart-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "cart-toast";
      el.className = "cart-toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => el.classList.remove("is-visible"), 2200);
  };

  const renderBadges = (items) => {
    const count = countItems(items);
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = String(count);
      el.hidden = count === 0;
    });
  };

  const renderDrawer = (items) => {
    const list = document.querySelector("[data-cart-list]");
    const empty = document.querySelector("[data-cart-empty]");
    const summary = document.querySelector("[data-cart-summary]");
    const totalEl = document.querySelector("[data-cart-subtotal]");
    const pixEl = document.querySelector("[data-cart-pix]");
    const checkoutBtns = document.querySelectorAll("[data-cart-checkout]");

    if (!list) return;

    if (!items.length) {
      list.innerHTML = "";
      if (empty) empty.hidden = false;
      if (summary) summary.hidden = true;
      checkoutBtns.forEach((btn) => {
        btn.classList.add("disabled");
        btn.setAttribute("aria-disabled", "true");
      });
      return;
    }

    if (empty) empty.hidden = true;
    if (summary) summary.hidden = false;
    checkoutBtns.forEach((btn) => {
      btn.classList.remove("disabled");
      btn.removeAttribute("aria-disabled");
    });

    const total = subtotal(items);
    if (totalEl) totalEl.textContent = money(total);
    if (pixEl) pixEl.textContent = money(total * PIX_DISCOUNT);

    list.innerHTML = items
      .map(
        (item) => `
      <div class="cart-line" data-id="${item.id}">
        <div class="cart-line-media">
          ${
            item.image
              ? `<img src="${item.image}" alt="" />`
              : `<div class="cart-line-placeholder">🌱</div>`
          }
        </div>
        <div class="cart-line-body">
          <strong>${item.name}</strong>
          <div class="cart-line-price">${money(item.price)} · ${money(
            Number(item.price) * Number(item.qty)
          )}</div>
          <div class="qty-control" data-cart-qty>
            <button type="button" data-action="dec" aria-label="Diminuir">−</button>
            <input type="number" min="1" max="99" value="${item.qty}" aria-label="Quantidade" />
            <button type="button" data-action="inc" aria-label="Aumentar">+</button>
          </div>
        </div>
        <button type="button" class="cart-remove" data-action="remove" aria-label="Remover">×</button>
      </div>`
      )
      .join("");
  };

  const renderCheckout = (items) => {
    const list = document.querySelector("[data-checkout-list]");
    if (!list) return;

    const empty = document.querySelector("[data-checkout-empty]");
    const form = document.querySelector("[data-checkout-form]");
    const totalEl = document.querySelector("[data-checkout-subtotal]");
    const pixEl = document.querySelector("[data-checkout-pix]");

    if (!items.length) {
      list.innerHTML = "";
      if (empty) empty.hidden = false;
      if (form) form.hidden = true;
      return;
    }

    if (empty) empty.hidden = true;
    if (form) form.hidden = false;

    const total = subtotal(items);
    if (totalEl) totalEl.textContent = money(total);
    if (pixEl) pixEl.textContent = money(total * PIX_DISCOUNT);

    list.innerHTML = items
      .map(
        (item) => `
      <div class="checkout-line">
        <div>
          <strong>${item.name}</strong>
          <div class="text-muted small">${item.qty} × ${money(item.price)}</div>
        </div>
        <strong>${money(Number(item.price) * Number(item.qty))}</strong>
      </div>`
      )
      .join("");
  };

  const render = () => {
    const items = readCart();
    renderBadges(items);
    renderDrawer(items);
    renderCheckout(items);
  };

  const bindProductCards = () => {
    document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest("[data-product]");
        if (!card) return;
        const qtyInput = card.querySelector("[data-qty-input]");
        addItem(
          {
            id: card.dataset.productId,
            name: card.dataset.productName,
            price: card.dataset.productPrice,
            image: card.dataset.productImage || "",
            sku: card.dataset.productSku || "",
          },
          qtyInput ? qtyInput.value : 1
        );
      });
    });

    document.querySelectorAll("[data-product] [data-qty-control]").forEach((control) => {
      const input = control.querySelector("[data-qty-input]");
      control.querySelector("[data-action='dec']")?.addEventListener("click", () => {
        input.value = Math.max(1, Number(input.value || 1) - 1);
      });
      control.querySelector("[data-action='inc']")?.addEventListener("click", () => {
        input.value = Math.min(99, Number(input.value || 1) + 1);
      });
    });
  };

  const bindDrawer = () => {
    const list = document.querySelector("[data-cart-list]");
    if (!list) return;

    list.addEventListener("click", (event) => {
      const line = event.target.closest(".cart-line");
      if (!line) return;
      const id = line.dataset.id;
      const action = event.target.closest("[data-action]")?.dataset.action;
      const input = line.querySelector("input");
      if (action === "inc") setQty(id, Number(input.value) + 1);
      if (action === "dec") setQty(id, Number(input.value) - 1);
      if (action === "remove") setQty(id, 0);
    });

    list.addEventListener("change", (event) => {
      const input = event.target.closest("input");
      if (!input) return;
      const line = input.closest(".cart-line");
      if (line) setQty(line.dataset.id, input.value);
    });
  };

  const bindCheckout = () => {
    const form = document.querySelector("[data-checkout-form]");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!readCart().length) return;

      const customer = {
        name: form.querySelector("[name='name']")?.value.trim() || "",
        city: form.querySelector("[name='city']")?.value.trim() || "",
        note: form.querySelector("[name='note']")?.value.trim() || "",
      };

      const url = whatsappUrl(customer);
      window.open(url, "_blank", "noopener");
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindProductCards();
    bindDrawer();
    bindCheckout();
    render();
  });

  window.CantinhoCart = {
    addItem,
    setQty,
    clearCart,
    readCart,
    whatsappUrl,
    buildWhatsAppMessage,
    render,
  };
})();
