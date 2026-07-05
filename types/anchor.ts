export type AnchorType = "home" | "work" | "school" | "station" | string;

export interface Anchor {
  id: string;
  title: string;
  type: AnchorType;
  customTypeLabel?: string;
  lat: number;
  lng: number;
  googlePlaceId?: string;
  address?: string;
  color?: string;
  createdAt: string;
}
