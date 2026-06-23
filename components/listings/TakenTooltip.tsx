"use client";

import { format } from "date-fns";

interface TakenTooltipProps {
  takenDate?: string;
}

export function TakenTooltip({ takenDate }: TakenTooltipProps) {
  if (!takenDate) return <span>Taken</span>;

  try {
    const date = new Date(takenDate);
    const formattedDate = format(date, "MMM d, yyyy");
    return <span>Taken on {formattedDate}</span>;
  } catch {
    return <span>Taken</span>;
  }
}
