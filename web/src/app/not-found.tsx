export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <section className="container section text-center">
      <h1>Página não encontrada</h1>
      <p className="muted">Esse endereço não existe no catálogo.</p>
      <a className="btn-buy" style={{ maxWidth: 220, display: "inline-block", marginTop: 16 }} href="/">
        Voltar ao início
      </a>
    </section>
  );
}
