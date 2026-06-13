export interface Evaluation {
  id: string;
  listing_id: string;
  template_id: string;
  responses: Record<string, number | string>;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  version: number;
  criteria: Criterion[];
  updated_at: string;
}

export interface Threshold {
  min?: number;
  max?: number;
  score: -1 | 0 | 1;
}

export interface Criterion {
  id: string;
  name: string;
  description?: string;
  type: "checkbox" | "rating" | "number" | "text" | "select" | "derived";
  category: string;
  options?: string[];
  scores?: Record<string, -1 | 0 | 1>;
  thresholds?: Threshold[];
  derivedFrom?: string[];
}
