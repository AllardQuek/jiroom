"use client";

import { Viewing } from "@/types/listing";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye } from "lucide-react";
import { useState } from "react";
import { useLocale } from "next-intl";
import { ScheduleViewingForm } from "./ScheduleViewingForm";

interface ViewingSectionProps {
  viewing: Viewing | null;
  listingId: string;
  onViewingUpdate: (updates: Partial<Viewing>) => void;
  onViewingCreate: (viewing: Viewing) => void;
}

export function ViewingSection({
  viewing,
  listingId,
  onViewingUpdate,
  onViewingCreate,
}: ViewingSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const locale = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
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
        <Button size="sm" onClick={() => setIsFormOpen(true)}>
          <Calendar className="h-4 w-4 mr-1.5" />
          Schedule
        </Button>
        {isFormOpen && (
          <div className="mt-4">
            <ScheduleViewingForm
              listingId={listingId}
              onCancel={() => setIsFormOpen(false)}
              onSubmit={(data) => {
                const newViewing: Viewing = {
                  id: crypto.randomUUID(),
                  ...data,
                  created_at: new Date().toISOString(),
                };
                onViewingCreate(newViewing);
                setIsFormOpen(false);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Eye className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Viewing</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="text-left flex-1 group"
          >
            {viewing.scheduled_date ? (
              <div className="flex items-center gap-1.5 text-sm group-hover:text-primary transition-colors">
                <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>{formatDate(viewing.scheduled_date)}</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                No date scheduled
              </p>
            )}
          </button>

          <div className="flex items-center gap-1">
            {viewing.scheduled_date && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground shrink-0"
                onClick={() => onViewingUpdate({ scheduled_date: undefined })}
              >
                Remove date
              </Button>
            )}
          </div>
        </div>

        {isFormOpen && (
          <div className="border rounded-lg bg-muted p-4">
            <ScheduleViewingForm
              listingId={listingId}
              viewing={viewing}
              onCancel={() => setIsFormOpen(false)}
              onSubmit={(data) => {
                onViewingUpdate({
                  scheduled_date: data.scheduled_date || undefined,
                });
                setIsFormOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
