"use client";

import { useEffect, useState } from "react";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { calculateScore } from "@/lib/utils/calculateScore";

interface ScoreDisplayProps {
  listingId: string;
}

export function ScoreDisplay({ listingId }: ScoreDisplayProps) {
  const evaluation = useEvaluationStore((state) => state.getEvaluationByListingId(listingId));
  const templates = useTemplateStore((state) => state.templates);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (evaluation && templates.length > 0) {
      // Use the first template (or could match by template_id)
      const template = templates[0];
      const calculatedScore = calculateScore(evaluation.responses, template);
      setScore(calculatedScore);
    } else {
      setScore(null);
    }
  }, [evaluation, templates]);

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
