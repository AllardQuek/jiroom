export interface Listing {
  id: string;
  source_url: string;
  source_platform: string;
  title: string;
  price: number;
  area: string;
  status: "saved" | "viewed" | "rejected" | "shortlisted";
  created_at: string;
}

export interface Viewing {
  id: string;
  listing_id: string;
  scheduled_date: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}
