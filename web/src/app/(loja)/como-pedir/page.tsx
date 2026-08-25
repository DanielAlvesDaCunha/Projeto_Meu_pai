import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Como pedir" };

export default function ComoPedirPage() {
  return (
    <>
      <section className="container section">
        <div className="section-title">
          <h1>Como pedir</h1>
        </div>
        <p className="page-lead">
          Tutorial rápido: escolha as mudas no site, monte o pedido e finalize no WhatsApp. Sem
          cadastro e sem carrinho complicado.
        </p>
      </section>

      <section className="container" style={{ paddingBottom: "1rem" }}>
        <ol className="tutorial-steps">
          <li className="tutorial-step">
            <span className="n">1</span>
            <div>
              <h2>Escolha a muda</h2>
              <p className="muted" style={{ margin: 0 }}>
                No catálogo, toque em <strong>Comprar</strong>. Pode misturar várias suculentas no
                mesmo pedido.
              </p>
            </div>
          </li>
          <li className="tutorial-step">
            <span className="n">2</span>
            <div>
              <h2>Revise o pedido</h2>
              <p className="muted" style={{ margin: 0 }}>
                Abra o ícone de pedido no topo. Ajuste quantidade, remova itens e confira o Pix.
              </p>
            </div>
          </li>
          <li className="tutorial-step">
            <span className="n">3</span>
            <div>
              <h2>Finalize no WhatsApp</h2>
              <p className="muted" style={{ margin: 0 }}>
                Em <Link href="/pedido">Meu pedido</Link> informe nome/cidade e envie a mensagem
                pronta.
              </p>
            </div>
          </li>
          <li className="tutorial-step">
            <span className="n">4</span>
            <div>
              <h2>Confirme frete e pagamento</h2>
              <p className="muted" style={{ margin: 0 }}>
                Combinamos disponibilidade, envio ou retirada e Pix na conversa.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="container section">
        <div className="section-title">
          <h2>Depois que você pagar</h2>
        </div>
        <div className="trust-grid">
          <div className="trust-card">
            <strong>Confirmação</strong>
            <p className="muted" style={{ margin: 0 }}>
              Você recebe a confirmação no WhatsApp com o resumo do pedido.
            </p>
          </div>
          <div className="trust-card">
            <strong>Separação</strong>
            <p className="muted" style={{ margin: 0 }}>
              As mudas são separadas e identificadas individualmente.
            </p>
          </div>
          <div className="trust-card">
            <strong>Envio / retirada</strong>
            <p className="muted" style={{ margin: 0 }}>
              Combinamos frete ou horário de retirada na conversa.
            </p>
          </div>
        </div>
        <div className="trust-note">
          <strong>Confiança</strong>
          Você só paga depois de confirmar tudo no WhatsApp. Sem cobrança surpresa no site.
        </div>
        <div className="text-center" style={{ marginTop: "1.5rem" }}>
          <Link className="btn-buy" style={{ maxWidth: 220 }} href="/">
            Ver catálogo
          </Link>
        </div>
      </section>
    </>
  );
}
