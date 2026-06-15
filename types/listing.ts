export interface Listing {
  id: string;
  source_url: string;
  source_platform: string;
  title: string;
  price: number;
  area: string;
  status: "new" | "to_view" | "viewed";
  notes?: string; // listing-level notes
  lat?: number;
  lng?: number;
  googlePlaceId?: string;
  created_at: string;
}

export interface Viewing {
  id: string;
  listing_id: string;
  scheduled_date?: string;
  created_at: string;
}
