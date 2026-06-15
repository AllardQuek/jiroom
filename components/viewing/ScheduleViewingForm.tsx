"use client";

import { useState } from "react";
import { Viewing } from "@/types/listing";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = ["00", "15", "30", "45"];
const months = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => String(currentYear + i));

function getDaysInMonth(month: string, year: string) {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if ([4, 6, 9, 11].includes(m)) return 30;
  if (m === 2) return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28;
  return 31;
}

function parseExistingDate(isoString?: string) {
  const now = new Date();
  const defaultYear = String(now.getFullYear());
  const defaultMonth = String(now.getMonth() + 1).padStart(2, "0");
  const defaultDay = String(now.getDate()).padStart(2, "0");

  if (!isoString) {
    return {
      year: defaultYear,
      month: defaultMonth,
      day: defaultDay,
      hour: "12",
      minute: "00",
      ampm: "PM" as const,
    };
  }
  const d = new Date(isoString);
  const h = d.getHours();
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, "0"),
    day: String(d.getDate()).padStart(2, "0"),
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
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);
  const [year, setYear] = useState(initial.year);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [ampm, setAmpm] = useState<"AM" | "PM">(initial.ampm);

  const daysInMonth = getDaysInMonth(month, year);
  const validDays = Array.from({ length: daysInMonth }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let scheduled_date: string | undefined;
      if (year && month && day) {
        let hour24 = parseInt(hour);
        if (ampm === "PM" && hour24 !== 12) hour24 += 12;
        if (ampm === "AM" && hour24 === 12) hour24 = 0;
        scheduled_date = `${year}-${month}-${day}T${String(hour24).padStart(2, "0")}:${minute}:00`;
      }
      onSubmit({ listing_id: listingId, scheduled_date });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5 w-full">
          <label className="text-xs font-medium text-muted-foreground">
            Date
          </label>
          <div className="flex items-center justify-center gap-1.5 w-full">
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="h-9 w-[72px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {validDays.map((d) => (
                  <SelectItem key={d} value={d} className="text-sm">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-muted-foreground/40 text-sm">/</span>

            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="h-9 w-[88px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="text-sm">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-muted-foreground/40 text-sm">/</span>

            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="h-9 w-[84px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y} className="text-sm">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
