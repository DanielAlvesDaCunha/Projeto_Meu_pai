import Link from "next/link";

export function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="Gerenciar loja">
      <Link href="/admin">Resumo</Link>
      <Link href="/admin/produtos">Anúncios</Link>
      <Link href="/admin/produtos/novo">+ Novo anúncio</Link>
      <Link href="/admin/categorias">Categorias</Link>
      <Link href="/admin/pedidos">Pedidos</Link>
    </nav>
  );
}
