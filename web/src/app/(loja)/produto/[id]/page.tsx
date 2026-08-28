import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { getDemoCatalog } from "@/lib/demoCatalog";
import { hasUsableDatabaseUrl, prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/money";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  if (hasUsableDatabaseUrl()) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { category: true },
      });
      if (product) {
        const dto = toProductDTO(product);
        return (
          <section className="container section product-detail-page">
            <nav className="breadcrumb-nav" aria-label="breadcrumb">
              <Link href="/">Início</Link>
              <span>/</span>
              <Link href="/produtos">Produtos</Link>
              {product.category ? (
                <>
                  <span>/</span>
                  <Link href={`/${product.category.slug}`}>{product.category.name}</Link>
                </>
              ) : null}
              <span>/</span>
              <strong>{product.name}</strong>
            </nav>
            <ProductDetail product={dto} categoryName={product.category?.name} />
          </section>
        );
      }
    } catch (error) {
      console.error("Product detail query failed:", error);
    }
  }

  const demo = getDemoCatalog().novidades.find((item) => item.id === productId);
  if (!demo) notFound();

  const dto = toProductDTO(demo);
  return (
    <section className="container section product-detail-page">
      <nav className="breadcrumb-nav" aria-label="breadcrumb">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/produtos">Produtos</Link>
        <span>/</span>
        <strong>{demo.name}</strong>
      </nav>
      <ProductDetail product={dto} />
    </section>
  );
}
