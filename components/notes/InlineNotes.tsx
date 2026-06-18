"use client";

import { useState, useEffect } from "react";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";

interface InlineNotesProps {
  notes: string;
  onUpdate: (notes: string) => void;
  updatedAt?: string;
  label?: string;
}

export function InlineNotes({
  notes,
  onUpdate,
  updatedAt,
  label = "Notes",
}: InlineNotesProps) {
  const [localValue, setLocalValue] = useState(notes);

  useEffect(() => {
    setLocalValue(notes);
  }, [notes]);

  const formatTimestamp = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleBlur = () => {
    if (localValue !== notes) {
      onUpdate(localValue);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        {updatedAt && localValue && (
          <span className="text-[10px] text-muted-foreground/50">
            Updated {formatTimestamp(updatedAt)}
          </span>
        )}
      </div>
      <AutoResizeTextarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="Add notes... Use '-' for bullet points"
        className="text-sm rounded-lg"
      />
    </div>
  );
}
