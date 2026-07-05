"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import type { GuideNodeData } from "@/data/guide-types";

const PHASE_GRADIENTS: Record<string, string> = {
  explore: "from-blue-500/20 via-blue-500/5 to-transparent",
  evaluate: "from-amber-500/20 via-amber-500/5 to-transparent",
  execute: "from-emerald-500/20 via-emerald-500/5 to-transparent",
};

export const PhaseHeaderNode = memo(function PhaseHeaderNode({
  data,
}: NodeProps) {
  const d = data as unknown as GuideNodeData;
  const phaseId = d.phaseId ?? "";
  const subtitle = d.subtitle ?? "";
  const gradient = PHASE_GRADIENTS[phaseId] ?? "from-card to-muted/60";

  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-1 w-full",
        "px-8 py-3.5 rounded-2xl",
        `bg-gradient-to-b ${gradient}`,
        "border border-border/30 shadow-panel",

      ].join(" ")}
    >
      <span className="text-base font-extrabold tracking-[0.2em] text-foreground/80 uppercase">
        {d.label}
      </span>
      {subtitle && (
        <span className="text-[10px] text-muted-foreground/50 font-medium tracking-wider uppercase">
          {subtitle}
        </span>
      )}
    </div>
  );
});
