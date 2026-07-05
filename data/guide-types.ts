export type PhaseId = "explore" | "evaluate" | "execute";

export interface LinkItem {
  label: string;
  url: string;
}

export interface ContentTable {
  headers: string[];
  rows: string[][];
}

export interface TopicContent {
  notes?: string[];
  bullets: string[];
  tips: string[];
  links?: LinkItem[];
  table?: ContentTable;
}

export type GuideNodeData = {
  phaseId?: PhaseId;
  label: string;
  emoji: string;
  content?: TopicContent;
  expanded?: boolean;
  highlighted?: boolean;
  row?: number;
  subtitle?: string;
  color?: string;
  [key: string]: unknown;
};

export const COLLAPSED_NODE_HEIGHT = 48;
export const MAX_CONTENT_HEIGHT = 600;

function estimateWrappedTextHeight(text: string, charsPerLine: number) {
  return Math.max(1, Math.ceil(text.length / charsPerLine));
}

export function estimateNodeContentHeight(content?: TopicContent): number {
  if (!content) return 0;

  const hasBullets = content.bullets.length > 0;
  const hasTips = content.tips.length > 0;
  const hasLinks = (content.links ?? []).length > 0;
  const hasTable = !!content.table;

  let h = 28; // pt-3 (12) + pb-4 (16)

  if (content.notes && content.notes.length > 0) {
    h += content.notes.length * 16;
  }

  if (hasBullets) {
    h += content.bullets.reduce((sum, bullet) => {
      return sum + estimateWrappedTextHeight(bullet, 48) * 18 + 4;
    }, 0);
  }

  if (hasTips) {
    if (hasBullets) h += 12;
    h += 20; // p-2.5 vertical
    h += content.tips.reduce((sum, tip) => {
      return sum + estimateWrappedTextHeight(tip, 50) * 18 + 4;
    }, 0);
  }

  if (hasLinks) {
    if (hasBullets || hasTips) h += 12;
    h += 4; // pt-1
    h += (content.links ?? []).length * 20;
  }

  if (hasTable) {
    if (hasBullets || hasTips || hasLinks) h += 12;
    h += 8 + 24 + content.table!.rows.length * 24;
  }

  return Math.min(h, MAX_CONTENT_HEIGHT);
}

export function estimateExpandedNodeHeight(content?: TopicContent): number {
  if (!content) return COLLAPSED_NODE_HEIGHT;
  return COLLAPSED_NODE_HEIGHT + estimateNodeContentHeight(content);
}
