"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ViewingStatusButtonsProps {
  currentStatus: string;
  onStatusChange: (status: "to_view" | "upcoming" | "viewed" | "skipped" | "cancelled") => void;
}

const statusConfig: Record<
  string,
  { label: string; color: string; variant: "default" | "secondary" | "outline" }
> = {
  to_view: { label: "To View", color: "bg-gray-500", variant: "outline" },
  upcoming: { label: "Upcoming", color: "bg-blue-500", variant: "default" },
  viewed: { label: "Viewed", color: "bg-green-500", variant: "default" },
  skipped: { label: "Skipped", color: "bg-yellow-500", variant: "secondary" },
  cancelled: { label: "Cancelled", color: "bg-red-500", variant: "outline" },
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
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(status)}
            className={isActive ? config.color : ""}
          >
            {config.label}
          </Button>
        );
      })}
    </div>
  );
}
