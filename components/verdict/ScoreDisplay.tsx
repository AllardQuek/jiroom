"use client";

import { useMemo } from "react";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { useListingStore } from "@/store/listingStore";
import { calculateScore } from "@/lib/utils/calculateScore";

interface ScoreDisplayProps {
  listingId: string;
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Score:</span>
      <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
        {score}
      </span>
      <span className="text-sm text-muted-foreground">/100</span>
    </div>
  );
}
