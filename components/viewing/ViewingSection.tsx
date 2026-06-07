"use client";

import { Viewing } from "@/types/listing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useState } from "react";
import { ViewingStatusButtons } from "./ViewingStatusButtons";
import { InlineNotes } from "@/components/notes/InlineNotes";
import { ScheduleViewingForm } from "./ScheduleViewingForm";

interface ViewingSectionProps {
  viewing: Viewing | null;
  listingId: string;
  onViewingUpdate: (updates: Partial<Viewing>) => void;
  onViewingCreate: (viewing: Viewing) => void;
}

const statusLabels: Record<string, string> = {
  to_view: "To View",
  upcoming: "Upcoming",
  viewed: "Viewed",
  skipped: "Skipped",
  cancelled: "Cancelled",
};

const statusColors: Record<string, string> = {
  to_view: "bg-stone-100 text-stone-700 border-stone-200",
  upcoming: "bg-blue-100 text-blue-700 border-blue-200",
  viewed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  skipped: "bg-amber-100 text-amber-700 border-amber-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export function ViewingSection({
  viewing,
  listingId,
  onViewingUpdate,
  onViewingCreate,
}: ViewingSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!viewing) {
    return (
      <div className="rounded-xl bg-muted/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Viewing</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">Not scheduled yet</p>
        <Button size="sm" onClick={() => setIsScheduleFormOpen(true)}>
          <Calendar className="h-4 w-4 mr-1.5" />
          Schedule
        </Button>
        {isScheduleFormOpen && (
          <div className="mt-4">
            <ScheduleViewingForm
              listingId={listingId}
              onCancel={() => setIsScheduleFormOpen(false)}
              onSubmit={(data) => {
                const newViewing: Viewing = {
                  id: crypto.randomUUID(),
                  ...data,
                  created_at: new Date().toISOString(),
                };
                onViewingCreate(newViewing);
                setIsScheduleFormOpen(false);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Viewing</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={statusColors[viewing.status]}>
              {statusLabels[viewing.status]}
            </Badge>
            {viewing.scheduled_date && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(viewing.scheduled_date)}
              </span>
            )}
          </div>

          <ViewingStatusButtons
            currentStatus={viewing.status}
            onStatusChange={(status) => onViewingUpdate({ status })}
          />

          <InlineNotes
            notes={viewing.notes || ""}
            onUpdate={(notes) =>
              onViewingUpdate({
                notes,
                notes_updated_at: new Date().toISOString(),
              })
            }
            updatedAt={viewing.notes_updated_at}
            label="Notes"
          />

          {viewing.scheduled_date && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => onViewingUpdate({ scheduled_date: undefined })}
            >
              Remove date
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
