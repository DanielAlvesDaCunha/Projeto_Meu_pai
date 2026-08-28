import Link from "next/link";
import { logoutAdmin } from "@/lib/actions/auth";

type NavItem = { href: string; label: string; icon: string };

const NAV: NavItem[] = [
  { href: "/admin", label: "Resumo", icon: "◫" },
  { href: "/admin/produtos", label: "Anúncios", icon: "▦" },
  { href: "/admin/produtos/novo", label: "Novo anúncio", icon: "+" },
  { href: "/admin/banners", label: "Banners", icon: "▣" },
  { href: "/admin/categorias", label: "Categorias", icon: "☰" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "◎" },
];

type Props = {
  userName: string;
  userEmail: string;
  children: React.ReactNode;
};

export function AdminDashboardShell({ userName, userEmail, children }: Props) {
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-kicker">Paulo Suculentas</span>
          <strong>Gerenciar loja</strong>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Menu do lojista">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="admin-sidebar-link">
              <span className="admin-sidebar-icon" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <Link className="admin-sidebar-link admin-sidebar-link-muted" href="/" target="_blank">
            Ver loja pública ↗
          </Link>
          <form action={logoutAdmin}>
            <button type="submit" className="admin-sidebar-logout">
              Sair da conta
            </button>
          </form>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-main-head">
          <div>
            <p className="admin-main-kicker">Área do lojista</p>
            <h1 className="admin-main-title">{userName}</h1>
            <p className="admin-main-sub">{userEmail}</p>
          </div>
          <form action={logoutAdmin} className="admin-main-logout-wrap">
            <button type="submit" className="admin-main-logout">
              Sair
            </button>
          </form>
        </header>
        <div className="admin-main-body">{children}</div>
      </div>
    </div>
  );
}
