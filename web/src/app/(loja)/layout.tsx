import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
