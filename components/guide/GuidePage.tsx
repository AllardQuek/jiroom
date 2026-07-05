"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

import { JourneyMap } from "./JourneyMap";
import { INITIAL_NODES, INITIAL_EDGES } from "@/data/guide-content";

export function GuidePage() {
  const t = useTranslations("guide");
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    new Set()
  );

  const handleToggleNode = useCallback((nodeId: string) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  return (
    <div className="h-[calc(100dvh-5rem)] w-full flex flex-col relative">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-card/50 backdrop-blur-sm flex-shrink-0 z-10">
        <div>
          <h1 className="text-base font-bold text-foreground">{t("title")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("subtitle")}
          </p>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <JourneyMap
            nodes={INITIAL_NODES}
            edges={INITIAL_EDGES}
            expandedNodeIds={expandedNodeIds}
            onNodeClick={handleToggleNode}
          />
      </div>
    </div>
  );
}