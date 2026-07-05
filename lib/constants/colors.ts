import { AnchorType } from "@/types/anchor";

/**
 * Centralized color constants for the application.
 * These colors are used in JavaScript/React contexts where CSS variables cannot be directly used.
 * For CSS-only contexts, use CSS variables from globals.css.
 */

// Vibrant color palette for custom anchor types (includes predefined type colors)
const CUSTOM_ANCHOR_PALETTE = [
  "#E11D48", // home (red)
  "#D946EF", // work (fuchsia)
  "#0EA5E9", // school (sky)
  "#F97316", // station (orange)
  "#EF4444", // red
  "#F59E0B", // amber
  "#84CC16", // lime
  "#10B981", // emerald
  "#06B6D4", // cyan
  "#3B82F6", // blue
  "#6366F1", // indigo
  "#8B5CF6", // violet
  "#EC4899", // pink
];

// Get a color from the palette based on string hash
function getPaletteColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CUSTOM_ANCHOR_PALETTE.length;
  return CUSTOM_ANCHOR_PALETTE[index];
}

// Light mode colors (default)
const LIGHT_COLORS = {
  anchors: {
    home: "#E11D48",
    work: "#D946EF",
    school: "#0EA5E9",
    station: "#F97316",
  },
  status: {
    new: "#9CA3AF",
    to_view: "#3B82F6",
    viewed: "#F59E0B",
  },
  area: [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#F97316",
    "#84CC16",
    "#6366F1",
    "#14B8A6",
    "#A855F7",
  ],
  score: {
    null: "#d4d4d4",
    excellent: "#059669",
    good: "#65a30d",
    neutral: "#a8a29e",
    fair: "#d97706",
    poor: "#dc2626",
  },
  accent: [
    "#2dd4bf",
    "#60a5fa",
    "#f59e0b",
    "#a78bfa",
    "#f472b6",
    "#34d399",
    "#fb923c",
    "#22d3ee",
  ],
  verdict: {
    yes: { label: "Yes", fg: "#059669", bg: "#05966920" },
    maybe: { label: "Maybe", fg: "#D97706", bg: "#D9770620" },
    no: { label: "No", fg: "#DC2626", bg: "#DC262620" },
  },
};

// Dark mode colors (adjusted for better contrast on dark backgrounds)
const DARK_COLORS = {
  anchors: {
    home: "#F472B6",
    work: "#E879F9",
    school: "#38BDF8",
    station: "#FB923C",
  },
  status: {
    new: "#A1A1AA",
    to_view: "#60A5FA",
    viewed: "#FBBF24",
  },
  area: [
    "#60A5FA",
    "#F87171",
    "#34D399",
    "#FBBF24",
    "#A78BFA",
    "#F472B6",
    "#22D3EE",
    "#FB923C",
    "#A3E635",
    "#818CF8",
    "#2DD4BF",
    "#C084FC",
  ],
  score: {
    null: "#71717a",
    excellent: "#10B981",
    good: "#84CC16",
    neutral: "#A1A1AA",
    fair: "#F59E0B",
    poor: "#EF4444",
  },
  accent: [
    "#2DD4BF",
    "#60A5FA",
    "#FBBF24",
    "#A78BFA",
    "#F472B6",
    "#34D399",
    "#FB923C",
    "#22D3EE",
  ],
  verdict: {
    yes: { label: "Yes", fg: "#10B981", bg: "#10B98130" },
    maybe: { label: "Maybe", fg: "#F59E0B", bg: "#F59E0B30" },
    no: { label: "No", fg: "#EF4444", bg: "#EF444430" },
  },
};

/**
 * Get theme-appropriate colors
 * @param theme - 'light' or 'dark'
 * @returns Color constants for the specified theme
 */
export function getThemeColors(theme: "light" | "dark") {
  return theme === "dark" ? DARK_COLORS : LIGHT_COLORS;
}

/**
 * Get anchor colors for a theme
 */
export function getAnchorColors(
  theme: "light" | "dark"
): Record<string, string> {
  return getThemeColors(theme).anchors;
}

/**
 * Get color for an anchor type (handles custom types with palette fallback)
 */
export function getAnchorColorForType(
  type: string,
  theme: "light" | "dark" = "light"
): string {
  const colors = getAnchorColors(theme);
  if (type in colors) return colors[type];
  return getPaletteColor(type);
}

/**
 * Get status colors for a theme
 */
export function getStatusColors(
  theme: "light" | "dark"
): Record<string, string> {
  return getThemeColors(theme).status;
}

/**
 * Get area palette for a theme
 */
export function getAreaPalette(theme: "light" | "dark"): string[] {
  return getThemeColors(theme).area;
}

/**
 * Get score colors for a theme
 */
export function getScoreColors(
  theme: "light" | "dark"
): typeof LIGHT_COLORS.score {
  return getThemeColors(theme).score;
}

/**
 * Get accent colors for a theme
 */
export function getAccentColors(theme: "light" | "dark"): string[] {
  return getThemeColors(theme).accent;
}

/**
 * Get verdict styles for a theme
 */
export function getVerdictStyles(
  theme: "light" | "dark"
): typeof LIGHT_COLORS.verdict {
  return getThemeColors(theme).verdict;
}

// Backwards compatibility - export light mode as default
export const ANCHOR_COLORS: Record<string, string> = LIGHT_COLORS.anchors;
export const CUSTOM_ANCHOR_PALETTE_EXPORT = CUSTOM_ANCHOR_PALETTE;
export const STATUS_COLORS: Record<string, string> = LIGHT_COLORS.status;
export const AREA_PALETTE = LIGHT_COLORS.area;
export const SCORE_COLORS = LIGHT_COLORS.score;
export const ACCENT_COLORS = LIGHT_COLORS.accent;
export const VERDICT_STYLES = LIGHT_COLORS.verdict;
