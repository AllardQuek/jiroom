import { Criterion, Template } from "@/types/evaluation";

export function calculateScore(
  responses: Record<string, number | string>,
  template: Template
): number {
  if (!template.criteria.length) {
    return 0;
  }

  let totalWeight = 0;
  let weightedSum = 0;

  for (const criterion of template.criteria) {
    const response = responses[criterion.id];
    if (response === undefined) continue;

    const weight = criterion.weight;
    totalWeight += weight;

    let value = 0;

    switch (criterion.type) {
      case "rating":
        // Rating 1-5: normalize to 0-1, then multiply by weight
        value = (typeof response === "number" ? response : 0) / 5;
        break;
      case "checkbox":
        // Checkbox: 1 or 0 (stored as string "true"/"false" or number 1/0)
        value = response === "true" || response === 1 ? 1 : 0;
        break;
      case "number":
        // Number: normalize based on reasonable range (0-100)
        value = Math.min((typeof response === "number" ? response : 0) / 100, 1);
        break;
      case "text":
      case "select":
        // Text/Select: no score contribution
        value = 0;
        break;
    }

    weightedSum += value * weight;
  }

  // Normalize to 0-100 scale
  if (totalWeight === 0) return 0;
  return Math.round((weightedSum / totalWeight) * 100);
}
