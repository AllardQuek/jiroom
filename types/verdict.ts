export interface Verdict {
  id: string;
  listing_id: string;
  status: "pass" | "fail" | "maybe";
  updated_at: string;
}
