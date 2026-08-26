import { MODULES } from "@/lib/constants";
import { ModuleLanding } from "@/components/modules/ModuleLanding";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const mod = MODULES.find((m) => m.slug === slug);
  if (!mod) return {};
  return buildMetadata({
    title: mod.title,
    description: mod.description,
    path: `/moduller/${mod.slug}`,
  });
}

export default async function ModulePage({ params }: Props) {
  const { slug } = await params;
  const mod = MODULES.find((m) => m.slug === slug);
  if (!mod) notFound();
  return <ModuleLanding module={mod} />;
}
