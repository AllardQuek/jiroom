"use client";

import { useMemo, useState, useEffect } from "react";
import { Listing } from "@/types/listing";
import { Template, Criterion, Evaluation } from "@/types/evaluation";
import { Verdict } from "@/types/verdict";
import { Viewing } from "@/types/listing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Star, ExternalLink, Check, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ComparisonColumnProps {
  listing: Listing;
  template: Template | undefined;
  evaluation: Evaluation | undefined;
  verdict: Verdict | null;
  viewing: Viewing | null;
  score: number | null;
  isWinner: boolean;
  showCriteria: boolean;
  categoryFilter: string;
  onRemove: () => void;
}

function CriterionValue({
  criterion,
  value,
}: {
  criterion: Criterion;
  value: number | string | undefined;
}) {
  if (value === undefined || value === "") {
    return <span className="text-muted-foreground/40 text-xs">&mdash;</span>;
  }

  switch (criterion.type) {
    case "checkbox":
      return value === "true" ? (
        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
          <Check size={11} strokeWidth={3} />
          Yes
        </span>
      ) : value === "na" ? (
        <span className="text-muted-foreground/50 text-xs">N/A</span>
      ) : (
        <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
          <Minus size={11} strokeWidth={3} />
          No
        </span>
      );
    case "rating": {
      const n = Number(value);
      return (
        <span className="text-amber-500 text-xs tracking-[0.05em]">
          {Array.from({ length: 5 }, (_, i) =>
            i < n ? "\u2605" : "\u2606"
          ).join("")}
        </span>
      );
    }
    case "number":
      return (
        <span className="text-foreground text-xs tabular-nums font-medium">
          {value}
        </span>
      );
    case "select":
    case "text":
    default:
      return (
        <span className="text-foreground text-xs max-w-[120px] truncate block text-right">
          {value}
        </span>
      );
  }
}

function ScoreRing({ score }: { score: number | null }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  const circumference = 2 * Math.PI * 28;
  const fill =
    score !== null
      ? `${(score / 100) * circumference} ${circumference}`
      : `0 ${circumference}`;

  const ringColor =
    score === null
      ? "#e7e5e4"
      : score >= 70
        ? "#059669"
        : score >= 40
          ? "#d97706"
          : "#dc2626";

  const labelColor =
    score === null
      ? "#d4d4d4"
      : score >= 70
        ? "#059669"
        : score >= 40
          ? "#d97706"
          : "#dc2626";

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#e7e5e4"
          strokeWidth="4"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke={ringColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={animated ? fill : `0 ${circumference}`}
          style={{
            transition: "stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-lg font-bold tabular-nums leading-none"
          style={{ color: labelColor }}
        >
          {score !== null ? score : "—"}
        </span>
      </div>
    </div>
  );
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  yes: "default",
  maybe: "secondary",
  no: "destructive",
  undecided: "outline",
};

const statusLabel: Record<string, string> = {
  yes: "Yes",
  maybe: "Maybe",
  no: "No",
  undecided: "Undecided",
};

export function ComparisonColumn({
  listing,
  template,
  evaluation,
  verdict,
  viewing,
  score,
  isWinner,
  showCriteria,
  categoryFilter,
  onRemove,
}: ComparisonColumnProps) {
  const router = useRouter();
  const responses = evaluation?.responses ?? {};

  const groupedCriteria = useMemo(() => {
    if (!template) return {};
    const groups: Record<string, Criterion[]> = {};
    for (const c of template.criteria) {
      if (categoryFilter !== "all" && c.category !== categoryFilter) continue;
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    }
    return groups;
  }, [template, categoryFilter]);

  const totalCriteria = template?.criteria.length ?? 0;
  const answeredCount = template
    ? template.criteria.filter(
        (c) => responses[c.id] !== undefined && responses[c.id] !== ""
      ).length
    : 0;

  return (
    <Card className="overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-snug line-clamp-2 flex-1">
            {listing.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 -mt-0.5 -mr-1.5"
            onClick={onRemove}
            aria-label="Remove from comparison"
          >
            <X size={13} />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
          <span className="text-sm font-semibold tabular-nums text-foreground">
            ${listing.price}
            <span className="text-muted-foreground text-xs font-normal">
              /mo
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            {listing.area} sqft
          </span>
          {listing.source_platform && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 font-medium"
            >
              {listing.source_platform}
            </Badge>
          )}
          {isWinner && (
            <Badge
              variant="outline"
              className="border-amber-300/60 bg-amber-50 text-amber-700 text-[10px] px-1.5 py-0 font-semibold"
            >
              <Star
                size={8}
                className="fill-amber-500 text-amber-500 -mt-0.5 mr-0.5 inline"
              />
              Best
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <ScoreRing score={score} />

          <div className="space-y-1.5 min-w-0">
            {verdict && (
              <div className="flex items-center gap-1.5">
                <Badge
                  variant={statusVariant[verdict.status] ?? "outline"}
                  className="text-[10px] px-2 py-0 font-semibold uppercase tracking-wider h-5"
                >
                  {statusLabel[verdict.status]}
                </Badge>
              </div>
            )}
            {viewing?.scheduled_date && (
              <div className="text-xs text-muted-foreground/70">
                Viewing{" "}
                {new Date(viewing.scheduled_date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
            {totalCriteria > 0 && (
              <div className="text-xs text-muted-foreground/50">
                {answeredCount}/{totalCriteria} criteria answered
              </div>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs"
          onClick={() => router.push(`/listings?detail=${listing.id}`)}
        >
          <ExternalLink size={12} className="mr-1.5" />
          View details
        </Button>
      </CardContent>

      {showCriteria && template && (
        <div className="cmp-reveal border-t border-border/50">
          {Object.keys(groupedCriteria).length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground/50">
              No criteria in this category
            </div>
          ) : (
            <div className="p-4 space-y-4 bg-muted/30">
              {Object.entries(groupedCriteria).map(([category, criteria]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {category}
                    </span>
                    <span className="h-px flex-1 bg-border/50" />
                    <span className="text-xs text-muted-foreground/60">
                      {
                        criteria.filter(
                          (c) =>
                            responses[c.id] !== undefined &&
                            responses[c.id] !== ""
                        ).length
                      }
                      /{criteria.length}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {criteria.map((criterion) => {
                      const answered =
                        responses[criterion.id] !== undefined &&
                        responses[criterion.id] !== "";
                      return (
                        <div
                          key={criterion.id}
                          className={`group flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                            answered
                              ? "hover:bg-background/80"
                              : "hover:bg-background/40"
                          }`}
                        >
                          <div className="min-w-0 flex-1 flex items-baseline gap-1.5">
                            <span
                              className={`text-xs leading-snug transition-colors ${
                                answered
                                  ? "text-foreground"
                                  : "text-muted-foreground/50"
                              }`}
                            >
                              {criterion.name}
                            </span>
                            {criterion.description && (
                              <span className="text-[10px] text-muted-foreground/40 hidden sm:inline">
                                &middot; {criterion.description}
                              </span>
                            )}
                            {criterion.weight > 1 && (
                              <span className="text-[9px] text-muted-foreground/40 font-medium">
                                &times;{criterion.weight}
                              </span>
                            )}
                          </div>
                          <div className="shrink-0 ml-3">
                            <CriterionValue
                              criterion={criterion}
                              value={responses[criterion.id]}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
