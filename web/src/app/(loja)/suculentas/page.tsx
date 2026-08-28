import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ de?: string; ate?: string; ordenar?: string }>;
};

export default async function LegacySuculentasRedirect({ searchParams }: Props) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  if (sp.de) qs.set("de", sp.de);
  if (sp.ate) qs.set("ate", sp.ate);
  if (sp.ordenar) qs.set("ordenar", sp.ordenar);
  const tail = qs.toString();
  redirect(tail ? `/produtos/suculentas?${tail}` : "/produtos/suculentas");
}
