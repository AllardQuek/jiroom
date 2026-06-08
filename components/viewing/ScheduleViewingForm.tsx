"use client";

import { useState } from "react";
import { Viewing } from "@/types/listing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  if (!isoString) {
    return { date: "", hour: "12", minute: "00", ampm: "PM" as const };
  }
  const d = new Date(isoString);
  const h = d.getHours();
  return {
    date: isoString.split("T")[0],
    hour: h === 0 ? "12" : h > 12 ? String(h - 12) : String(h),
    minute: String(Math.round(d.getMinutes() / 15) * 15).padStart(2, "0"),
    ampm: (h >= 12 ? "PM" : "AM") as "AM" | "PM",
  };
}

interface ScheduleViewingFormProps {
  listingId: string;
  viewing?: Viewing;
  onCancel: () => void;
  onSubmit: (data: { listing_id: string; scheduled_date?: string }) => void;
}

export function ScheduleViewingForm({
  listingId,
  viewing,
  onCancel,
  onSubmit,
}: ScheduleViewingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initial = parseExistingDate(viewing?.scheduled_date);
  const [date, setDate] = useState(initial.date);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [ampm, setAmpm] = useState<"AM" | "PM">(initial.ampm);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let scheduled_date: string | undefined;
      if (date) {
        let hour24 = parseInt(hour);
        if (ampm === "PM" && hour24 !== 12) hour24 += 12;
        if (ampm === "AM" && hour24 === 12) hour24 = 0;
        scheduled_date = `${date}T${String(hour24).padStart(2, "0")}:${minute}:00`;
      }
      onSubmit({ listing_id: listingId, scheduled_date });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Time
          </label>
          <div className="flex items-center gap-1.5">
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

            <button
              type="button"
              onClick={() => setAmpm(ampm === "AM" ? "PM" : "AM")}
              className={`h-9 px-2.5 rounded-md text-xs font-medium border transition-colors ${
                ampm === "AM"
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary border-primary/30"
              }`}
            >
              {ampm}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          size="sm"
          className="flex-1 h-8 text-xs"
        >
          Cancel
        </Button>
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
    </div>
  );
}
