import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { Providers } from "@/components/Providers";
import { getStoreConfig } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Paulo Suculentas",
    template: "%s | Paulo Suculentas",
  },
  description: "Cultivo e vendas de suculentas. Pedido pelo WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const store = getStoreConfig();

  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,700&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers storeName={store.storeName} whatsappNumber={store.whatsappNumber}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
