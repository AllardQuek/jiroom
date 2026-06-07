export interface Listing {
  id: string;
  source_url: string;
  source_platform: string;
  title: string;
  price: number;
  area: string;
  status: "new" | "to_view" | "viewed" | "archived" | "shortlisted";
  created_at: string;
}

export interface Viewing {
  id: string;
  listing_id: string;
  scheduled_date?: string; // optional, only set when scheduled
  status: "to_view" | "upcoming" | "viewed" | "skipped" | "cancelled";
  notes?: string;
  created_at: string;
}
