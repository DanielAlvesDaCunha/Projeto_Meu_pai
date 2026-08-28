import { redirect, notFound } from "next/navigation";
import { ALL_CATEGORY_SLUGS } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ de?: string; ate?: string; ordenar?: string }>;
};

export default async function LegacyCategoryRedirect({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  if (!ALL_CATEGORY_SLUGS.has(slug)) notFound();

  const qs = new URLSearchParams();
  if (sp.de) qs.set("de", sp.de);
  if (sp.ate) qs.set("ate", sp.ate);
  if (sp.ordenar) qs.set("ordenar", sp.ordenar);
  const tail = qs.toString();

  redirect(tail ? `/produtos/${slug}?${tail}` : `/produtos/${slug}`);
}
