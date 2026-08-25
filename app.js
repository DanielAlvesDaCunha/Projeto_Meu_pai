/**
 * CONFIGURE AQUI
 * Número do WhatsApp com DDI (só dígitos). Ex.: 5511999999999
 */
const WHATSAPP = "5511999999999";
const WHATSAPP_LABEL = "(11) 99999-9999";

const destaques = [
  {
    nome: "Echeveria Raindrops PT 11",
    sku: "ECH-RAIN-11",
    preco: 28.0,
    de: 32.0,
    foto: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=700&q=80",
  },
  {
    nome: "Graptoveria Lulu PT 9",
    sku: "GRA-LULU-09",
    preco: 18.0,
    de: 22.0,
    foto: "https://images.unsplash.com/photo-1485955900004-4eecf6f8bb41?auto=format&fit=crop&w=700&q=80",
  },
  {
    nome: "Echeveria Roman PT 9",
    sku: "ECH-ROM-09",
    preco: 16.0,
    de: null,
    foto: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=700&q=80",
  },
  {
    nome: "Haworthia Zebra PT 9",
    sku: "HAW-ZEB-09",
    preco: 24.0,
    de: 29.0,
    foto: "https://images.unsplash.com/photo-1463936577429-48e3ccee649f?auto=format&fit=crop&w=700&q=80",
  },
];

const maisVendidos = [
  {
    nome: "Kit 6 Suculentas Variadas PT 6",
    sku: "KIT-SUC-06",
    preco: 69.0,
    de: 84.0,
    foto: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=80",
  },
  {
    nome: "Sedum Burrito PT 11",
    sku: "SED-BUR-11",
    preco: 32.0,
    de: 38.0,
    foto: "https://images.unsplash.com/photo-1459411552884-841db9b3aa2f?auto=format&fit=crop&w=700&q=80",
  },
  {
    nome: "Crassula Ovata PT 11",
    sku: "CRA-OVA-11",
    preco: 35.0,
    de: null,
    foto: "https://images.unsplash.com/photo-1501004318641-b39e64514be8?auto=format&fit=crop&w=700&q=80",
  },
  {
    nome: "Aloe Vera Mini PT 9",
    sku: "ALO-MIN-09",
    preco: 22.0,
    de: 26.0,
    foto: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=700&q=80&sat=-30",
  },
];

const cactos = [
  {
    nome: "Cacto Variado PT 6",
    sku: "CAC-VAR-06",
    preco: 14.0,
    de: 18.0,
    foto: "https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=700&q=80",
  },
  {
    nome: "Opuntia Microdasys PT 9",
    sku: "OPU-MIC-09",
    preco: 26.0,
    de: null,
    foto: "https://images.unsplash.com/photo-1459411552884-841db9b3aa2f?auto=format&fit=crop&w=700&q=80&sat=-40",
  },
  {
    nome: "Echinocactus Grusonii PT 11",
    sku: "ECH-GRU-11",
    preco: 39.0,
    de: 45.0,
    foto: "https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=700&q=80&sat=-10",
  },
  {
    nome: "Mammillaria PT 9",
    sku: "MAM-PT-09",
    preco: 20.0,
    de: 24.0,
    foto: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=700&q=80&sat=-50",
  },
];

function money(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function pixPrice(v) {
  return money(+(v * 0.97).toFixed(2));
}

function parcelas(v) {
  if (v < 20) return `até 2x de ${money(v / 2)}`;
  const n = Math.min(6, Math.max(2, Math.floor(v / 5)));
  return `até ${n}x de ${money(v / n)}`;
}

function waLink(texto) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

function linkGeral() {
  return waLink(
    "Olá! Vi o site Cantinho das Suculentas e quero saber o que tem disponível."
  );
}

function desconto(de, preco) {
  if (!de || de <= preco) return null;
  return Math.round(((de - preco) / de) * 100);
}

function cardHTML(p) {
  const off = desconto(p.de, p.preco);
  const msg = `Olá! Quero comprar: ${p.nome} (${money(p.preco)}). Ainda está disponível?`;
  return `
    <article class="product">
      <div class="product-media">
        ${off ? `<span class="badge">${off}% OFF</span>` : ""}
        <img src="${p.foto}" alt="${p.nome}" loading="lazy" width="700" height="700" />
      </div>
      <div class="product-body">
        <h3>${p.nome}</h3>
        <p class="sku">${p.sku}</p>
        ${p.de ? `<p class="old-price">${money(p.de)}</p>` : `<p class="old-price">&nbsp;</p>`}
        <p class="price">${money(p.preco)}</p>
        <p class="installments">${parcelas(p.preco)}</p>
        <p class="pix">ou ${pixPrice(p.preco)} via Pix</p>
        <a class="btn-buy" href="${waLink(msg)}" target="_blank" rel="noopener">Comprar</a>
      </div>
    </article>
  `;
}

function render(id, lista) {
  document.getElementById(id).innerHTML = lista.map(cardHTML).join("");
}

document.querySelectorAll("[id^='wa-']").forEach((el) => {
  el.href = linkGeral();
});

document.querySelectorAll("#wa-top").forEach((el) => {
  el.textContent = `WhatsApp ${WHATSAPP_LABEL}`;
});

document.querySelectorAll(".contact-phone").forEach((el) => {
  el.textContent = `WhatsApp: ${WHATSAPP_LABEL}`;
});

render("grid-destaques", destaques);
render("grid-mais", maisVendidos);
render("grid-cactos", cactos);
