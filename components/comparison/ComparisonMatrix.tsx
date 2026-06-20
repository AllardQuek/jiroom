"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Listing, Viewing } from "@/types/listing";
import { Template, Criterion, Evaluation } from "@/types/evaluation";
import { Verdict } from "@/types/verdict";
import { ScoreResult } from "@/lib/utils/calculateScore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Star, Check, Minus } from "lucide-react";

function CriterionValue({
  criterion,
  value,
  listingPrice,
  responses,
  isMobile,
}: {
  criterion: Criterion;
  value: number | string | undefined;
  listingPrice?: number;
  responses?: Record<string, number | string>;
  isMobile: boolean;
}) {
  if (criterion.type === "derived") {
    if (listingPrice === undefined) {
      return <span className="text-muted-foreground/40 text-sm">&mdash;</span>;
    }
    let total = listingPrice;
    if (criterion.derivedFrom && responses) {
      for (const depId of criterion.derivedFrom) {
        const depResponse = responses[depId];
        if (depResponse !== undefined && depResponse !== "") {
          total += Number(depResponse) || 0;
        }
      }
    }
    return (
      <span className="text-foreground text-sm tabular-nums font-medium">
        ${total.toLocaleString()}
      </span>
    );
  }

  if (value === undefined || value === "") {
    return <span className="text-muted-foreground/40 text-sm">&mdash;</span>;
  }

  switch (criterion.type) {
    case "checkbox":
      return value === "true" ? (
        <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
          <Check size={13} strokeWidth={3} />
          Yes
        </span>
      ) : value === "na" ? (
        <span className="text-muted-foreground/50 text-sm">N/A</span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-red-500 text-sm font-medium">
          <Minus size={13} strokeWidth={3} />
          No
        </span>
      );
    case "rating": {
      const n = Number(value);
      return (
        <span className="text-amber-500 text-sm tracking-[0.05em]">
          {Array.from({ length: 5 }, (_, i) =>
            i < n ? "\u2605" : "\u2606"
          ).join("")}
        </span>
      );
    }
    case "number":
      return (
        <span className="text-foreground text-sm tabular-nums font-medium">
          {value}
        </span>
      );
    case "select":
    case "text":
    default:
      const isTextTruncated = String(value).length > 50;
      const displayText = isTextTruncated ? String(value).slice(0, 50) + "..." : String(value);

      if (!isTextTruncated) {
        return (
          <span className="text-foreground text-sm text-left whitespace-nowrap">
            {value}
          </span>
        );
      }

      const interactiveContent = (
        <div className="text-foreground text-sm text-left cursor-pointer hover:bg-muted/50 active:bg-muted/70 transition-colors whitespace-nowrap">
          {displayText}
        </div>
      );

      return isMobile ? (
        <span className="text-foreground text-sm text-left whitespace-pre-wrap">
          {value}
        </span>
      ) : (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger>
              {interactiveContent}
            </TooltipTrigger>
            <TooltipContent align="center" collisionPadding={16}>
              <p className="whitespace-pre-wrap">{value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
  }
}

function formatNet(net: number) {
  return net > 0 ? `+${net}` : `${net}`;
}

function CompactScoreDisplay({ score }: { score: ScoreResult | null }) {
  const net = score?.net ?? null;

  const ringColor =
    net === null
      ? "#d4d4d4"
      : net >= 4
        ? "#059669"
        : net >= 1
          ? "#65a30d"
          : net === 0
            ? "#a8a29e"
            : net >= -2
              ? "#d97706"
              : "#dc2626";

  if (!score) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative w-10 h-10 shrink-0">
          <svg className="w-10 h-10" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#e7e5e4" strokeWidth="4" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold tabular-nums leading-none text-[#d4d4d4]">&mdash;</span>
          </div>
        </div>
        <span className="text-[11px] text-muted-foreground/50">No scores</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10 shrink-0">
        <svg className="w-10 h-10" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#e7e5e4" strokeWidth="4" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold tabular-nums leading-none" style={{ color: ringColor }}>
            {formatNet(score.net)}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="font-bold text-emerald-600 tabular-nums">{score.positives}</span>
          <span className="font-semibold text-emerald-700/70 leading-none">↑</span>
          <span className="font-bold text-red-600 tabular-nums ml-0.5">{score.negatives}</span>
          <span className="font-semibold text-red-700/70 leading-none">↓</span>
          <span className="font-bold text-muted-foreground tabular-nums ml-0.5">{score.neutrals}</span>
          <span className="text-muted-foreground/70 leading-none">—</span>
        </div>
        {score.answered > 0 && (
          <div className="h-1 rounded-full bg-muted overflow-hidden flex max-w-[100px]">
            {score.positives > 0 && (
              <div className="h-full bg-emerald-400" style={{ width: `${(score.positives / score.answered) * 100}%` }} />
            )}
            {score.neutrals > 0 && (
              <div className="h-full bg-muted-foreground/20" style={{ width: `${(score.neutrals / score.answered) * 100}%` }} />
            )}
            {score.negatives > 0 && (
              <div className="h-full bg-red-400" style={{ width: `${(score.negatives / score.answered) * 100}%` }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ComparisonMatrixProps {
  listings: Listing[];
  template: Template | undefined;
  evaluations: Evaluation[];
  verdicts: Verdict[];
  viewings: Viewing[];
  scores: (ScoreResult | null)[];
  onRemove: (id: string) => void;
}

export function ComparisonMatrix({
  listings,
  template,
  evaluations,
  verdicts,
  viewings,
  scores,
  onRemove,
}: ComparisonMatrixProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [criteriaColumnWidth, setCriteriaColumnWidth] = useState(170);

  useEffect(() => {
    // Load saved width from localStorage
    const savedWidth = localStorage.getItem('criteria-column-width');
    if (savedWidth) {
      setCriteriaColumnWidth(Number(savedWidth));
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = criteriaColumnWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(120, Math.min(300, startWidth + deltaX));
      setCriteriaColumnWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      localStorage.setItem('criteria-column-width', criteriaColumnWidth.toString());
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const bestNet = Math.max(
    ...scores.filter((s): s is ScoreResult => s !== null).map((s) => s.net),
    -Infinity
  );

  const groupedCriteria = useMemo(() => {
    if (!template) return {};
    const groups: Record<string, Criterion[]> = {};
    for (const c of template.criteria) {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    }
    return groups;
  }, [template]);

  const totalCriteria = template?.criteria.length ?? 0;

  const getResponses = (listingId: string) => {
    return evaluations.find((e) => e.listing_id === listingId)?.responses ?? {};
  };

  const getAnsweredCount = (listingId: string) => {
    if (!template) return 0;
    const responses = getResponses(listingId);
    return template.criteria.filter(
      (c) => responses[c.id] !== undefined && responses[c.id] !== ""
    ).length;
  };

  const numCols = listings.length;

  if (numCols === 0) return null;

  const accentColors = [
    "#2dd4bf", "#60a5fa", "#f59e0b", "#a78bfa",
    "#f472b6", "#34d399", "#fb923c", "#22d3ee",
  ];

  const gridItems: React.ReactNode[] = [];

  // ── Column headers ──
  gridItems.push(
    <div
      key="h-criteria"
      className="bg-background px-2 py-2.5 border-b border-border/40 font-semibold text-xs text-muted-foreground uppercase tracking-wider"
    >
      Criteria
    </div>
  );

  listings.forEach((listing, i) => {
    const score = scores[i];
    const verdict = verdicts.find((v) => v.listing_id === listing.id) ?? null;
    const viewing = viewings.find((v) => v.listing_id === listing.id) ?? null;
    const answeredCount = getAnsweredCount(listing.id);
    const isWinner =
      score !== null && score.net === bestNet && bestNet > 0;

    const verdictVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      yes: "default",
      maybe: "secondary",
      no: "destructive",
    };
    const verdictLabel: Record<string, string> = {
      yes: "Yes",
      maybe: "Maybe",
      no: "No",
    };

    gridItems.push(
      <div
        key={`h-${listing.id}`}
        className={`px-2 py-2.5 border-b border-border/40 space-y-1.5 ${isWinner ? "bg-amber-50/30" : "bg-background"}`}
      >
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/listings?detail=${listing.id}`}
            className="text-sm font-semibold leading-snug line-clamp-2 hover:underline decoration-muted-foreground/30 underline-offset-2 flex-1"
          >
            {listing.title}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 -mt-0.5 -mr-1"
            onClick={() => onRemove(listing.id)}
            aria-label="Remove from comparison"
          >
            <X size={12} />
          </Button>
        </div>

        <CompactScoreDisplay score={score} />

        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5">
          {verdict && (
            <Badge
              variant={verdictVariant[verdict.status] ?? "outline"}
              className="text-[10px] px-2 py-0 font-semibold uppercase tracking-wider h-5"
            >
              {verdictLabel[verdict.status]}
            </Badge>
          )}
          {isWinner && (
            <Badge
              variant="outline"
              className="border-amber-300/60 bg-amber-50 text-amber-700 text-[10px] px-1.5 py-0 font-semibold"
            >
              <Star size={8} className="fill-amber-500 text-amber-500 -mt-0.5 mr-0.5 inline" />
              Best
            </Badge>
          )}
          {viewing?.scheduled_date && (
            <span className="text-[10px] text-muted-foreground/60">
              {new Date(viewing.scheduled_date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground/50">
            {answeredCount}/{totalCriteria}
          </span>
        </div>
      </div>
    );
  });

  // ── Criteria rows ──
  const categoryEntries = Object.entries(groupedCriteria);
  let rowParity = 0;

  categoryEntries.forEach(([category, criteria], catIndex) => {
    const accent = accentColors[catIndex % accentColors.length];

    // Category header row
    gridItems.push(
      <div
        key={`cat-${category}`}
        className="flex items-center gap-3 px-2 py-2 bg-muted/40"
      >
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {category}
        </span>
        <span className="h-px flex-1 bg-border/20" />
      </div>
    );

    // Add empty cells for the remaining columns in the category header row
    for (let i = 0; i < numCols; i++) {
      gridItems.push(
        <div
          key={`cat-empty-${category}-${i}`}
          className="bg-muted/40 min-h-[38px]"
        />
      );
    }

    criteria.forEach((criterion) => {
      const isEven = rowParity % 2 === 0;
      rowParity++;

      const isUnansweredEverywhere = listings.every((l) => {
        const responses = getResponses(l.id);
        return (
          responses[criterion.id] === undefined ||
          responses[criterion.id] === ""
        );
      });

      const rowBg = isEven ? "bg-muted/[0.03]" : "";

      // Criterion name cell
      const criterionCellContent = (
        <div
          className={`px-2 py-2.5 text-sm leading-snug flex items-center min-h-[38px] ${
            isMobile ? "" : "cursor-pointer hover:bg-muted/50 active:bg-muted/70 transition-colors"
          } ${
            isUnansweredEverywhere ? "text-muted-foreground/40" : "text-foreground"
          }`}
        >
          <span className={isMobile ? "" : "truncate"}>{criterion.name}</span>
        </div>
      );

      gridItems.push(
        <div
          key={`n-${criterion.id}`}
          className={`bg-background ${rowBg || ""}`}
          style={{ borderLeft: `2px solid ${accent}` }}
        >
          {isMobile ? (
            criterionCellContent
          ) : (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {criterionCellContent}
                </TooltipTrigger>
                <TooltipContent side="top" align="start" collisionPadding={16}>
                  <p>{criterion.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );

      // Value cells for each listing
      listings.forEach((listing) => {
        const responses = getResponses(listing.id);
        const value = responses[criterion.id];
        const answered = value !== undefined && value !== "";

        gridItems.push(
          <div
            key={`v-${criterion.id}-${listing.id}`}
            className={`${rowBg || "bg-background"} px-2 py-2.5 flex items-center justify-start min-h-[38px] overflow-hidden ${
              answered ? "" : "opacity-30"
            }`}
          >
            <CriterionValue
              criterion={criterion}
              value={value}
              listingPrice={listing.price}
              responses={responses}
              isMobile={isMobile}
            />
          </div>
        );
      });
    });
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-border/15 max-w-5xl mx-auto">
      <div
        className="grid min-w-[500px] gap-px bg-border/12 relative"
        style={{ gridTemplateColumns: `${criteriaColumnWidth}px repeat(${numCols}, 1fr)` }}
      >
        {gridItems}
        <div
          className="absolute top-0 bottom-0 left-0 w-1 bg-transparent hover:bg-primary cursor-col-resize z-[100] transition-colors"
          style={{ left: `${criteriaColumnWidth}px` }}
          onMouseDown={handleResizeStart}
        />
      </div>
    </div>
  );
}
