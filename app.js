/**
 * CONFIGURE AQUI
 * Troque o número pelo WhatsApp do seu pai (só dígitos, com DDI 55).
 * Exemplo: 5511999999999
 */
const WHATSAPP = "5511999999999";

const plantas = [
  {
    nome: "Echeveria Blue Bird",
    preco: "R$ 28",
    desc: "Roseta azul-acinzentada, compacta e fácil de cuidar.",
    foto: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Haworthia Zebra",
    preco: "R$ 32",
    desc: "Listras brancas marcantes. Gosta de luz indireta.",
    foto: "https://images.unsplash.com/photo-1485955900004-4eecf6f8bb41?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Sedum Burrito",
    preco: "R$ 35",
    desc: "Pendente com folhinhas gorduchas. Ótima em vaso alto.",
    foto: "https://images.unsplash.com/photo-1463936577429-48e3ccee649f?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Crassula Ovata",
    preco: "R$ 45",
    desc: "Árvore da fortuna. Cresce bem em sol da manhã.",
    foto: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Aloe Vera Mini",
    preco: "R$ 25",
    desc: "Pequena, resistente e ótima para iniciantes.",
    foto: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80&sat=-20",
  },
  {
    nome: "Graptopetalum",
    preco: "R$ 30",
    desc: "Tons rosados no sol. Ideal para varanda.",
    foto: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80",
  },
];

function waLink(texto) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

function linkGeral() {
  return waLink("Olá! Vi o site Cantinho das Suculentas e quero saber o que tem disponível.");
}

document.getElementById("wa-geral").href = linkGeral();
document.getElementById("wa-hero").href = linkGeral();
document.getElementById("wa-footer").href = linkGeral();

const grid = document.getElementById("grid");

plantas.forEach((p) => {
  const msg = `Olá! Tenho interesse na suculenta "${p.nome}" (${p.preco}). Ainda está disponível?`;
  const card = document.createElement("article");
  card.className = "plant";
  card.innerHTML = `
    <img src="${p.foto}" alt="${p.nome}" loading="lazy" width="800" height="1000" />
    <div class="plant-body">
      <h3>${p.nome}</h3>
      <p class="price">${p.preco}</p>
      <p class="desc">${p.desc}</p>
      <a class="btn" href="${waLink(msg)}" target="_blank" rel="noopener">Quero esta</a>
    </div>
  `;
  grid.appendChild(card);
});
