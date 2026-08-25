import Link from "next/link";
import { logoutUser } from "@/lib/actions/auth";

type Props = {
  userName: string;
};

export function AdminTopBar({ userName }: Props) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner container">
        <div className="admin-topbar-brand">
          <span className="admin-topbar-kicker">Paulo Suculentas</span>
          <strong>Gerenciar loja</strong>
        </div>
        <div className="admin-topbar-actions">
          <span className="admin-topbar-user">{userName}</span>
          <Link className="admin-topbar-link" href="/" target="_blank" rel="noopener noreferrer">
            Ver loja pública
          </Link>
          <form action={logoutUser}>
            <button type="submit" className="admin-topbar-logout">
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
