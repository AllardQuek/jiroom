"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";

interface TakenTooltipProps {
  takenDate?: string;
}

export function TakenTooltip({ takenDate }: TakenTooltipProps) {
  const t = useTranslations("listings");

  if (!takenDate) return <span>{t("taken")}</span>;

  let formattedDate: string | null = null;
  try {
    formattedDate = format(new Date(takenDate), "MMM d, yyyy");
  } catch {
    formattedDate = null;
  }

  return (
    <span>
      {formattedDate ? t("takenOn", { date: formattedDate }) : t("taken")}
    </span>
  );
}
