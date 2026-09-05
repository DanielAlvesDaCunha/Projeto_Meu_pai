import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import { SITE_ORIGIN } from "@/lib/site";
import { getStoreConfig } from "@/lib/store";
import "./globals.css";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Paulo Suculentas",
    template: "%s | Paulo Suculentas",
  },
  description: "Cultivo e vendas de suculentas. Pedido pelo WhatsApp.",
  applicationName: "Paulo Suculentas",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const store = getStoreConfig();

  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600;1,700&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var i=window.innerHeight,v=window.visualViewport&&window.visualViewport.height||i,c=Math.max(0,(window.outerHeight||i)-i),a=((screen&&screen.availHeight)||i)-c,h=Math.max(320,Math.min(i,v,document.documentElement.clientHeight||i,a||i));document.documentElement.style.setProperty("--app-h",Math.round(h)+"px");}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <Providers storeName={store.storeName} whatsappNumber={store.whatsappNumber}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
