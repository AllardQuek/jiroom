"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";

interface VerdictReasoningProps {
  reasoning: string;
  onReasoningChange: (reasoning: string) => void;
}

export function VerdictReasoning({
  reasoning,
  onReasoningChange,
}: VerdictReasoningProps) {
  const [localValue, setLocalValue] = useState(reasoning);
  const t = useTranslations("verdict");

  useEffect(() => {
    // Sync local state when the prop changes (e.g., external update)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(reasoning);
  }, [reasoning]);

  const handleBlur = () => {
    if (localValue !== reasoning) {
      onReasoningChange(localValue);
    }
  };

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {t("reasoning")}
      </span>
      <AutoResizeTextarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={t("reasoningPlaceholder")}
        className="text-sm rounded-lg"
      />
    </div>
  );
}
