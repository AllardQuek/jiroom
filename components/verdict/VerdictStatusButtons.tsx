"use client";

import { Button } from "@/components/ui/button";

interface VerdictStatusButtonsProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

const statusLabels: Record<string, string> = {
  yes: "Yes",
  maybe: "Maybe",
  no: "No",
  undecided: "Undecided",
};

const statusColors: Record<string, string> = {
  yes: "bg-green-500 hover:bg-green-600",
  maybe: "bg-yellow-500 hover:bg-yellow-600",
  no: "bg-red-500 hover:bg-red-600",
  undecided: "bg-gray-500 hover:bg-gray-600",
};

export function VerdictStatusButtons({
  currentStatus,
  onStatusChange,
}: VerdictStatusButtonsProps) {
  const statuses: Array<"yes" | "maybe" | "no" | "undecided"> = [
    "yes",
    "maybe",
    "no",
    "undecided",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Button
          key={status}
          size="sm"
          variant={currentStatus === status ? "default" : "outline"}
          className={
            currentStatus === status ? statusColors[status] : "border-gray-300"
          }
          onClick={() => onStatusChange(status)}
        >
          {statusLabels[status]}
        </Button>
      ))}
    </div>
  );
}
