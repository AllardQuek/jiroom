"use client";

import { useMemo } from "react";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { useListingStore } from "@/store/listingStore";
import { calculateScore } from "@/lib/utils/calculateScore";

interface ScoreDisplayProps {
  listingId: string;
}

function formatNet(net: number) {
  return net > 0 ? `+${net}` : `${net}`;
}

function netColor(net: number) {
  if (net >= 4) return "text-emerald-600";
  if (net >= 1) return "text-green-600";
  if (net === 0) return "text-muted-foreground";
  if (net >= -2) return "text-orange-600";
  return "text-red-600";
}

export function ScoreDisplay({ listingId }: ScoreDisplayProps) {
  const evaluation = useEvaluationStore((state) =>
    state.getEvaluationByListingId(listingId)
  );
  const templates = useTemplateStore((state) => state.templates);
  const listings = useListingStore((state) => state.listings);

  const score = useMemo(() => {
    if (!evaluation || templates.length === 0) {
      return null;
    }
    const listing = listings.find((l) => l.id === listingId);
    return calculateScore(evaluation.responses, templates[0], listing?.price);
  }, [evaluation, templates, listings, listingId]);

  if (score === null) {
    return (
      <div className="text-sm text-muted-foreground">
        No evaluation score available
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-sm text-muted-foreground">Score:</span>
        <span
          className={`text-2xl font-bold tabular-nums ${netColor(score.net)}`}
        >
          {formatNet(score.net)}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 mt-0.5">
        {score.positives > 0 && (
          <span className="text-emerald-600/70">{score.positives}↑</span>
        )}
        {score.negatives > 0 && (
          <span className="text-red-600/70">{score.negatives}↓</span>
        )}
        {score.neutrals > 0 && <span>{score.neutrals}—</span>}
        <span className="text-muted-foreground/40">
          · {score.answered} scored
        </span>
      </div>
    </div>
  );
}
