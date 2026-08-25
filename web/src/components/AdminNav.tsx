import Link from "next/link";

export function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="Admin">
      <Link href="/admin">Resumo</Link>
      <Link href="/admin/produtos">Anúncios</Link>
      <Link href="/admin/produtos/novo">+ Novo</Link>
      <Link href="/admin/categorias">Categorias</Link>
      <Link href="/admin/pedidos">Pedidos</Link>
      <Link href="/">Ver loja</Link>
    </nav>
  );
}
