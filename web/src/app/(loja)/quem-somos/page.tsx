import type { Metadata } from "next";
import Link from "next/link";
import { getStoreConfig, whatsappGeneralUrl } from "@/lib/store";

export const metadata: Metadata = { title: "Quem somos" };

export default function QuemSomosPage() {
  const store = getStoreConfig();
  const wa = whatsappGeneralUrl(store);

  return (
    <section className="container section">
      <div className="section-title">
        <h1>Quem somos</h1>
      </div>
      <p className="page-lead">
        A {store.storeName} cultiva e seleciona suculentas e cactos para quem quer planta de verdade,
        com foto real e pedido simples pelo WhatsApp.
      </p>

      <div className="trust-grid" style={{ marginTop: "1.75rem" }}>
        <div className="trust-card">
          <strong>Cultivo próprio</strong>
          <p className="muted" style={{ margin: 0 }}>
            Gibbifloras, echeverias e cactos saem do nosso cuidado para a sua casa, com cada muda
            identificada.
          </p>
        </div>
        <div className="trust-card">
          <strong>Pedido na conversa</strong>
          <p className="muted" style={{ margin: 0 }}>
            Você escolhe no site, confirma disponibilidade no WhatsApp e só paga depois de combinar.
          </p>
        </div>
        <div className="trust-card">
          <strong>Envio ou retirada</strong>
          <p className="muted" style={{ margin: 0 }}>
            Combinamos o melhor jeito de receber: envio ou retirada, no horário combinado na conversa.
          </p>
        </div>
      </div>

      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        <a className="btn-buy" style={{ maxWidth: 260, display: "inline-block" }} href={wa} target="_blank" rel="noopener noreferrer">
          Falar no WhatsApp
        </a>
      </p>
      <p className="muted" style={{ textAlign: "center" }}>
        Ou veja o <Link href="/como-pedir">passo a passo de como pedir</Link>.
      </p>
    </section>
  );
}
