"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ViewingStatusButtonsProps {
  currentStatus: string;
  onStatusChange: (status: "to_view" | "upcoming" | "viewed" | "skipped" | "cancelled") => void;
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  to_view: { label: "To View", variant: "outline" },
  upcoming: { label: "Upcoming", variant: "secondary" },
  viewed: { label: "Viewed", variant: "default" },
  skipped: { label: "Skipped", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function ViewingStatusButtons({
  currentStatus,
  onStatusChange,
}: ViewingStatusButtonsProps) {
  const statuses: Array<"to_view" | "upcoming" | "viewed" | "skipped" | "cancelled"> = [
    "to_view",
    "upcoming",
    "viewed",
    "skipped",
    "cancelled",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => {
        const config = statusConfig[status];
        const isActive = currentStatus === status;

        return (
          <Button
            key={status}
            variant={isActive ? config.variant : "outline"}
            size="sm"
            onClick={() => onStatusChange(status)}
            className={isActive ? "" : "opacity-60"}
          >
            {config.label}
          </Button>
        );
      })}
    </div>
  );
}
