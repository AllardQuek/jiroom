import { Criterion, Template } from "@/types/evaluation";

interface EvaluationResponse {
  criterion_id: string;
  value: string | number | boolean;
}

export function calculateScore(
  responses: EvaluationResponse[],
  template: Template
): number {
  if (!responses.length || !template.criteria.length) {
    return 0;
  }

  let totalWeight = 0;
  let weightedSum = 0;

  for (const criterion of template.criteria) {
    const response = responses.find((r) => r.criterion_id === criterion.id);
    if (!response) continue;

    const weight = criterion.weight;
    totalWeight += weight;

    let value = 0;

    switch (criterion.type) {
      case "rating":
        // Rating 1-5: normalize to 0-1, then multiply by weight
        value = (typeof response.value === "number" ? response.value : 0) / 5;
        break;
      case "checkbox":
        // Checkbox: 1 or 0
        value = response.value === true ? 1 : 0;
        break;
      case "number":
        // Number: normalize based on reasonable range (0-100)
        value = Math.min((typeof response.value === "number" ? response.value : 0) / 100, 1);
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
