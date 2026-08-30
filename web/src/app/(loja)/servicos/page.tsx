import type { Metadata } from "next";
import Link from "next/link";
import { getStoreConfig, whatsappGeneralUrl } from "@/lib/store";

export const metadata: Metadata = { title: "Serviços" };

export default function ServicosPage() {
  const store = getStoreConfig();
  const wa = whatsappGeneralUrl(store);

  return (
    <section className="container section">
      <div className="section-title">
        <h1>Serviços</h1>
      </div>
      <p className="page-lead">
        Tudo que a {store.storeName} faz para a planta chegar bem e o pedido ficar fácil.
      </p>

      <div className="trust-grid" style={{ marginTop: "1.75rem" }}>
        <div className="trust-card">
          <strong>Envio individual</strong>
          <p className="muted" style={{ margin: 0 }}>
            Cada muda vai identificada. Você sabe exatamente o que está recebendo.
          </p>
        </div>
        <div className="trust-card">
          <strong>Pedido pelo WhatsApp</strong>
          <p className="muted" style={{ margin: 0 }}>
            Montamos o pedido na conversa: disponibilidade, tamanho, envio ou retirada e Pix.
          </p>
        </div>
        <div className="trust-card">
          <strong>Retirada combinada</strong>
          <p className="muted" style={{ margin: 0 }}>
            Se preferir buscar, combinamos o melhor horário no WhatsApp {store.whatsappLabel}.
          </p>
        </div>
        <div className="trust-card">
          <strong>Catálogo com foto real</strong>
          <p className="muted" style={{ margin: 0 }}>
            Os anúncios usam as fotos das plantas. Lançamentos novos ficam 30 dias em evidência.
          </p>
        </div>
        <div className="trust-card">
          <strong>Orientação de cultivo</strong>
          <p className="muted" style={{ margin: 0 }}>
            Dúvida de sol, rega ou vaso? Pergunte na mesma conversa do pedido.
          </p>
        </div>
        <div className="trust-card">
          <strong>Pagamento combinado</strong>
          <p className="muted" style={{ margin: 0 }}>
            Pix ou outro meio combinado depois que o pedido estiver certo. Sem surpresa.
          </p>
        </div>
      </div>

      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link className="btn-buy" style={{ maxWidth: 260, display: "inline-block" }} href="/produtos">
          Ver o catálogo
        </Link>
      </p>
      <p className="muted" style={{ textAlign: "center" }}>
        <a href={wa} target="_blank" rel="noopener noreferrer">
          Ou chamar no WhatsApp
        </a>
      </p>
    </section>
  );
}
