import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Gerenciar loja",
    template: "%s | Gerenciar loja",
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-zone">{children}</div>;
}
