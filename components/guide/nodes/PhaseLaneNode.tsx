"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import type { GuideNodeData } from "@/data/guide-types";

const PHASE_BORDERS: Record<string, string> = {
  explore: "border-blue-500/20",
  evaluate: "border-amber-500/20",
  execute: "border-emerald-500/20",
};

export const PhaseLaneNode = memo(function PhaseLaneNode({
  data,
}: NodeProps) {
  const d = data as unknown as GuideNodeData;
  const phaseId = d.phaseId ?? "";
  const border = PHASE_BORDERS[phaseId] ?? "border-border/10";

  return (
    <div
      className={`w-full h-full rounded-3xl border-2 ${border} pointer-events-none`}
      style={{
        background: d.color
          ? `color-mix(in srgb, ${d.color} 6%, transparent)`
          : "transparent",
      }}
    />
  );
});
