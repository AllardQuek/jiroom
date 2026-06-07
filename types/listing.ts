export interface Listing {
  id: string;
  source_url: string;
  source_platform: string;
  title: string;
  price: number;
  area: string;
  status: "new" | "to_view" | "viewed" | "archived" | "shortlisted";
  notes?: string; // listing-level notes
  created_at: string;
}

export interface Viewing {
  id: string;
  listing_id: string;
  scheduled_date?: string; // optional, only set when scheduled
  status: "to_view" | "upcoming" | "viewed" | "skipped" | "cancelled";
  notes?: string;
  notes_updated_at?: string; // track when notes were last updated
  created_at: string;
}
