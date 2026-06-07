"use client";

import { Viewing } from "@/types/listing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Calendar, Clock } from "lucide-react";
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
  to_view: "bg-gray-500",
  upcoming: "bg-blue-500",
  viewed: "bg-green-500",
  skipped: "bg-yellow-500",
  cancelled: "bg-red-500",
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Viewing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            No viewing scheduled yet
          </p>
          <Button onClick={() => setIsScheduleFormOpen(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Viewing
          </Button>
          {isScheduleFormOpen && (
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
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Viewing</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={statusColors[viewing.status]}>
              {statusLabels[viewing.status]}
            </Badge>
            {viewing.scheduled_date && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {formatDate(viewing.scheduled_date)}
              </div>
            )}
          </div>

          <ViewingStatusButtons
            currentStatus={viewing.status}
            onStatusChange={(status) => onViewingUpdate({ status })}
          />

          <InlineNotes
            notes={viewing.notes || ""}
            onUpdate={(notes) => onViewingUpdate({ notes, notes_updated_at: new Date().toISOString() })}
            updatedAt={viewing.notes_updated_at}
            label="Viewing Notes"
          />

          {viewing.scheduled_date && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewingUpdate({ scheduled_date: undefined })}
            >
              Remove Scheduled Date
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
