import Link from "next/link";
import { requireAdminSession } from "@/lib/session";

export async function AdminNav() {
  await requireAdminSession();
  return (
    <nav className="admin-nav">
      <Link href="/admin">Resumo</Link>
      <Link href="/admin/produtos">Produtos</Link>
      <Link href="/admin/categorias">Categorias</Link>
      <Link href="/admin/pedidos">Pedidos</Link>
      <Link href="/">Ver loja</Link>
    </nav>
  );
}
