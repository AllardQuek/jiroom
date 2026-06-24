"use client";

import { useState } from "react";
import { Viewing } from "@/types/listing";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = ["00", "15", "30", "45"];

function parseExistingDate(isoString?: string) {
  const now = new Date();

  if (!isoString) {
    return {
      hour: "12",
      minute: "00",
      ampm: "PM" as const,
    };
  }
  const d = new Date(isoString);
  const h = d.getHours();
  return {
    hour: h === 0 ? "12" : h > 12 ? String(h - 12) : String(h),
    minute: String(Math.round(d.getMinutes() / 15) * 15).padStart(2, "0"),
    ampm: (h >= 12 ? "PM" : "AM") as "AM" | "PM",
  };
}

interface ScheduleViewingFormProps {
  listingId: string;
  viewing?: Viewing;
  onCancel?: () => void;
  onSubmit: (data: { listing_id: string; scheduled_date?: string }) => void;
  isScheduled?: boolean;
  scheduledDate?: string;
}

export function ScheduleViewingForm({
  listingId,
  viewing,
  onCancel,
  onSubmit,
  isScheduled = false,
  scheduledDate,
}: ScheduleViewingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initial = parseExistingDate(viewing?.scheduled_date);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    viewing?.scheduled_date
  );
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [ampm, setAmpm] = useState<"AM" | "PM">(initial.ampm);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let scheduled_date: string | undefined;
      if (selectedDate) {
        const date = new Date(selectedDate);
        let hour24 = parseInt(hour);
        if (ampm === "PM" && hour24 !== 12) hour24 += 12;
        if (ampm === "AM" && hour24 === 12) hour24 = 0;
        date.setHours(hour24, parseInt(minute), 0, 0);
        scheduled_date = date.toISOString();
      }
      onSubmit({ listing_id: listingId, scheduled_date });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatScheduledDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-4">
      {!isScheduled ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 w-full">
              <label className="text-xs font-medium text-muted-foreground">
                Date
              </label>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Select date"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Time
              </label>
              <div className="flex items-center justify-center gap-1.5 w-full">
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger className="h-9 w-[72px] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((h) => (
                      <SelectItem key={h} value={h} className="text-sm">
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-muted-foreground/40 text-sm">:</span>

                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger className="h-9 w-[76px] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m} className="text-sm">
                    {m}
                  </SelectItem>
                ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAmpm(ampm === "AM" ? "PM" : "AM")}
                  className="h-9 w-[64px] text-xs font-medium"
                >
                  {ampm}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="sm"
              className="flex-1 h-8 text-xs"
            >
              {isSubmitting ? "Saving..." : viewing ? "Update" : "Schedule"}
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="font-medium">{scheduledDate && formatScheduledDate(scheduledDate)}</span>
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              size="sm"
              className="flex-1 h-8 text-xs"
            >
              Cancel Schedule
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
