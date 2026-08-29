import Link from "next/link";
import { ProfileForm } from "@/components/ProfileForm";
import { logoutAdmin, logoutUser } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import { getDbUser, requireSession } from "@/lib/session";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function ContaPage() {
  const sessionUser = await requireSession();
  const user = await getDbUser(sessionUser.id);
  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const orders = isAdmin
    ? []
    : await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

  return (
    <section className="container section">
      <div className="section-title">
        <h1>{isAdmin ? "Sua conta" : "Minha conta"}</h1>
      </div>
      <div className="account-grid">
        <ProfileForm
          user={{
            name: user.name,
            email: user.email,
            phone: user.phone,
            city: user.city,
            address: user.address,
          }}
        />
        <div className="checkout-panel">
          {isAdmin ? (
            <>
              <h2>Loja</h2>
              <p className="muted">
                Para editar anúncios, use a barra <strong>Editar site</strong> no rodapé da loja.
              </p>
              <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link className="btn-buy" href="/admin" style={{ maxWidth: 200 }}>
                  Abrir painel
                </Link>
                <Link className="btn-filter" href="/">
                  Voltar à loja
                </Link>
                <form action={logoutAdmin}>
                  <button type="submit" className="btn-filter">
                    Sair
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <h2>Pedidos recentes</h2>
              {!orders.length ? (
                <p className="muted">Você ainda não fez pedidos.</p>
              ) : (
                <ul className="admin-list">
                  {orders.map((o) => (
                    <li key={o.id}>
                      <Link href={`/conta/pedidos/${o.id}`}>
                        {o.createdAt.toLocaleDateString("pt-BR")} · {money(Number(o.total))} ·{" "}
                        {o.status}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link className="section-more" href="/conta/pedidos">
                Ver todos os pedidos
              </Link>
              <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link className="btn-buy" href="/pedido" style={{ maxWidth: 200 }}>
                  Ir ao carrinho
                </Link>
                <form action={logoutUser}>
                  <button type="submit" className="btn-filter">
                    Sair
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
