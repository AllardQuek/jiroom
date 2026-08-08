"use client";

import { useState } from "react";
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

  const handleBlur = () => {
    if (localValue !== reasoning) {
      onReasoningChange(localValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("reasoning")}</label>
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
