import { Criterion, Template } from "@/types/evaluation";

function scoreFromThresholds(
  value: number,
  thresholds?: { min?: number; max?: number; score: -1 | 0 | 1 }[]
): number | null {
  if (!thresholds || thresholds.length === 0) return null;
  for (const t of thresholds) {
    const aboveMin = t.min === undefined || value >= t.min;
    const belowMax = t.max === undefined || value <= t.max;
    if (aboveMin && belowMax) return t.score;
  }
  return 0;
}

export interface ScoreResult {
  net: number;
  positives: number;
  negatives: number;
  neutrals: number;
  answered: number;
}

export function calculateScore(
  responses: Record<string, number | string>,
  template: Template,
  listingPrice?: number
): ScoreResult | null {
  if (!template.criteria.length) return null;

  let net = 0;
  let positives = 0;
  let negatives = 0;
  let neutrals = 0;

  for (const criterion of template.criteria) {
    const response = responses[criterion.id];

    if (response === undefined || response === "") continue;
    if (criterion.type === "text") continue;

    if (criterion.type === "derived") {
      let derivedValue = listingPrice ?? 0;
      if (criterion.derivedFrom) {
        for (const depId of criterion.derivedFrom) {
          const depResponse = responses[depId];
          if (depResponse !== undefined && depResponse !== "") {
            derivedValue += Number(depResponse) || 0;
          }
        }
      }
      const points = scoreFromThresholds(derivedValue, criterion.thresholds);
      if (points !== null) {
        net += points;
        if (points === 1) positives++;
        else if (points === -1) negatives++;
        else neutrals++;
      }
      continue;
    }

    if (response === "na") continue;

    let points: number | null = null;

    switch (criterion.type) {
      case "checkbox":
        points = response === "true" ? 1 : -1;
        break;
      case "rating": {
        const rating = typeof response === "number" ? response : Number(response);
        points = rating <= 2 ? -1 : rating === 3 ? 0 : 1;
        break;
      }
      case "select":
        points = criterion.scores?.[String(response)] ?? 0;
        break;
      case "number": {
        const numValue = typeof response === "number" ? response : Number(response);
        points = scoreFromThresholds(numValue, criterion.thresholds);
        break;
      }
    }

    if (points !== null) {
      net += points;
      if (points === 1) positives++;
      else if (points === -1) negatives++;
      else neutrals++;
    }
  }

  const answered = positives + negatives + neutrals;
  if (answered === 0) return null;

  return { net, positives, negatives, neutrals, answered };
}
