import { redirect } from "next/navigation";

type LegacyWorkPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyWorkPage({
  params,
}: LegacyWorkPageProps) {
  const { slug } = await params;
  redirect(`/s/${encodeURIComponent(slug)}`);
}
