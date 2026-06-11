export type AnchorType = "home" | "work" | "school" | "station" | "other";

export interface Anchor {
  id: string;
  title: string;
  type: AnchorType;
  lat: number;
  lng: number;
  googlePlaceId?: string;
  address?: string;
  color?: string;
  createdAt: string;
}
