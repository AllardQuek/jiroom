"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  label,
}: InlineNotesProps) {
  const [localValue, setLocalValue] = useState(notes);
  const t = useTranslations("notes");
  const locale = useLocale();

  useEffect(() => {
    // Sync local state when the prop changes (e.g., external update)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(notes);
  }, [notes]);

  const displayLabel = label ?? t("label");

  const formatTimestamp = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return t("justNow");
    if (diffMins < 60) return t("minAgo", { count: diffMins });

    return date.toLocaleDateString(locale, {
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
          {displayLabel}
        </span>
        {updatedAt && localValue && (
          <span className="text-[10px] text-muted-foreground/50">
            {t("updated", { time: formatTimestamp(updatedAt) })}
          </span>
        )}
      </div>
      <AutoResizeTextarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={t("placeholder")}
        className="text-sm rounded-lg"
      />
    </div>
  );
}
