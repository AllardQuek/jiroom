import { redirect } from "@/i18n/navigation";

export default async function SettingsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/listings", locale });
}
