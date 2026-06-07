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
  criteria: Criterion[];
  updated_at: string;
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number; // 1-3 scale
  type: "checkbox" | "rating" | "number" | "text" | "select";
  category: string;
  options?: string[]; // for select type
}
