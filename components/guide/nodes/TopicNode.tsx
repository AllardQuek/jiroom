"use client";

import { memo, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lightbulb,
  Link,
} from "lucide-react";

import type { GuideNodeData, ContentTable } from "@/data/guide-types";
import { MeasuredHeightContext } from "../HeightContext";

function renderTipWithLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <a
          key={i}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        >
          {match[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

type TopicData = Pick<
  GuideNodeData,
  "label" | "emoji" | "content" | "expanded" | "highlighted" | "phaseId"
>;

const PHASE_BORDER_COLORS: Record<string, string> = {
  explore: "rgb(59 130 246)",
  evaluate: "rgb(245 158 11)",
  execute: "rgb(16 185 129)",
};

function ContentTable({ table }: { table: ContentTable }) {
  if (table.rows.length === 0) return null;

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-border/30">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="text-left font-semibold text-muted-foreground py-1.5 pr-2 last:pr-0 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-border/10 last:border-0">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`py-1.5 pr-2 last:pr-0 leading-snug ${
                    ci === 0
                      ? "font-medium text-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  <span>{renderTipWithLinks(cell)}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const TopicNode = memo(function TopicNode({ id, data }: NodeProps) {
  const d = data as unknown as TopicData;
  const expanded = d.expanded ?? false;


  const highlighted = d.highlighted ?? false;
  const content = d.content;
  const phaseColor = PHASE_BORDER_COLORS[d.phaseId ?? ""] ?? "var(--border)";
  const bw = highlighted ? 2 : 1;
  const bc = highlighted
    ? "var(--primary)"
    : expanded
      ? `color-mix(in srgb, ${phaseColor} 50%, transparent)`
      : "var(--border)";
  const lc = highlighted ? "var(--primary)" : phaseColor;

  const stateClass = highlighted
    ? "ring-2 ring-primary/30 shadow-selection"
    : expanded
      ? "shadow-selection"
      : "hover:shadow-selection";

const handleContentClick = (e: React.MouseEvent) => {
  e.stopPropagation();
};

  const { reportHeight } = useContext(MeasuredHeightContext);
  const nodeRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const measuredRef = useRef(false);

  useLayoutEffect(() => {
    if (!expanded || measuredRef.current || !contentRef.current || !headerRef.current) return;
    const h = headerRef.current.offsetHeight + contentRef.current.offsetHeight + 1;
    if (h > 0) {
      measuredRef.current = true;
      reportHeight(id, h);
    }
  });

  useEffect(() => {
    if (!expanded) measuredRef.current = false;
  }, [expanded]);

  return (
    <div
      ref={nodeRef}
      className={`rounded-2xl bg-card transition-all duration-200 cursor-pointer overflow-hidden ${stateClass}`}
      style={{
        width: expanded ? 290 : 280,
        borderTopWidth: bw,
        borderRightWidth: bw,
        borderBottomWidth: bw,
        borderLeftWidth: 3,
        borderTopStyle: "solid",
        borderRightStyle: "solid",
        borderBottomStyle: "solid",
        borderLeftStyle: "solid",
        borderTopColor: bc,
        borderRightColor: bc,
        borderBottomColor: bc,
        borderLeftColor: lc,
      }}
    >
      <Handle type="target" position={Position.Left} className="!bg-border" />
      <Handle type="source" position={Position.Right} className="!bg-border" />

      <div ref={headerRef} className="flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-card to-muted/30 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg flex-shrink-0 opacity-90">{d.emoji}</span>
          <span className="text-sm font-semibold text-foreground truncate">
            {d.label}
          </span>
        </div>
        <span className="text-muted-foreground flex-shrink-0 transition-transform duration-200">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {expanded && content && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="border-t border-border/20 guide-scrollable"
          >
            <div ref={contentRef} className="px-4 pb-4 pt-3 space-y-3 select-text" onClick={handleContentClick}>
              {content.bullets.length > 0 && (
                <ul className="space-y-1">
                  {content.bullets.map((b, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02, duration: 0.15 }}
                      className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5"
                    >
                      <span className="text-foreground/30 mt-0.5 flex-shrink-0">
                        •
                      </span>
                      <span>{renderTipWithLinks(b)}</span>
                    </motion.li>
                  ))}
                </ul>
              )}

              {content.table && <ContentTable table={content.table} />}

              {content.tips.length > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-800/30 p-2.5">
                  <Lightbulb
                    size={14}
                    className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    {content.tips.map((tip, i) => (
                      <p
                        key={i}
                        className="text-xs text-foreground/80 leading-relaxed"
                      >
                        {renderTipWithLinks(tip)}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {(content.links ?? []).length > 0 && (
                <div className="space-y-1 pt-1">
                  {(content.links ?? []).map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <Link size={10} />
                      <span className="truncate">{link.label}</span>
                      <ExternalLink size={10} className="flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
