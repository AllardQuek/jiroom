"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface VerdictStatusButtonsProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

const statusColors: Record<string, string> = {
  yes: "bg-emerald-700 text-white border-emerald-800 hover:bg-emerald-800",
  maybe: "bg-amber-700 text-white border-amber-800 hover:bg-amber-800",
  no: "bg-red-700 text-white border-red-800 hover:bg-red-800",
};

export function VerdictStatusButtons({
  currentStatus,
  onStatusChange,
}: VerdictStatusButtonsProps) {
  const t = useTranslations("verdict");
  const statuses: Array<"yes" | "maybe" | "no"> = ["yes", "maybe", "no"];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Button
          key={status}
          size="sm"
          variant="outline"
          className={
            currentStatus === status
              ? statusColors[status]
              : "border-border text-foreground hover:bg-muted"
          }
          onClick={() => onStatusChange(status)}
        >
          {t(status)}
        </Button>
      ))}
    </div>
  );
}
