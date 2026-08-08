"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";

interface TakenTooltipProps {
  takenDate?: string;
}

export function TakenTooltip({ takenDate }: TakenTooltipProps) {
  const t = useTranslations("listings");

  if (!takenDate) return <span>{t("taken")}</span>;

  try {
    const date = new Date(takenDate);
    const formattedDate = format(date, "MMM d, yyyy");
    return <span>{t("takenOn", { date: formattedDate })}</span>;
  } catch {
    return <span>{t("taken")}</span>;
  }
}
