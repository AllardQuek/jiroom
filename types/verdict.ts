export interface Verdict {
  id: string;
  listing_id: string;
  status: "yes" | "maybe" | "no";
  reasoning?: string;
  score?: number; // calculated from evaluation
  updated_at: string;
  created_at: string;
}
