import type { Metadata } from "next";
import { getStoreConfig, whatsappGeneralUrl } from "@/lib/store";

export const metadata: Metadata = { title: "Contato" };

export default function ContatoPage() {
  const store = getStoreConfig();
  const wa = whatsappGeneralUrl(store);

  return (
    <section className="container section">
      <div className="section-title">
        <h1>Contato</h1>
      </div>
      <p className="page-lead">Fale direto com a loja pelo WhatsApp.</p>

      <div className="trust-note" style={{ marginTop: "1.5rem" }}>
        <strong>WhatsApp</strong>
        <p style={{ margin: "0.4rem 0 1rem" }}>{store.whatsappLabel}</p>
        <a className="btn-buy" style={{ maxWidth: 240, display: "inline-block" }} href={wa} target="_blank" rel="noopener noreferrer">
          Abrir WhatsApp
        </a>
      </div>

      <div className="trust-card" style={{ maxWidth: 760, margin: "1.25rem auto" }}>
        <strong>Podemos ajudar com</strong>
        <ul className="muted">
          <li>Disponibilidade de mudas e tamanhos</li>
          <li>Frete ou retirada</li>
          <li>Dúvidas de cultivo</li>
          <li>Pedidos mistos e kits</li>
        </ul>
      </div>
    </section>
  );
}
