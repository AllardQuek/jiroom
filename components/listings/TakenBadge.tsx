"use client";

import { useTranslations } from "next-intl";
import { XCircle } from "lucide-react";

interface TakenBadgeProps {
  takenDate?: string;
}

export function TakenBadge({ takenDate }: TakenBadgeProps) {
  const t = useTranslations("listings");
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
      <XCircle size={10} />
      <span>{t("taken")}</span>
    </div>
  );
}
