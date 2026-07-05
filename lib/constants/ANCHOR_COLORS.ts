import { Anchor } from "@/types/anchor";
import { ANCHOR_COLORS as COLORS, getAnchorColorForType } from "./colors";

export const ANCHOR_COLORS = COLORS;

/**
 * Get color for an anchor (handles custom types with palette fallback)
 */
export function getAnchorColor(anchor: Anchor): string {
  if (anchor.color) return anchor.color;
  return getAnchorColorForType(anchor.type);
}
