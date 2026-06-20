"use client";

import { useState } from "react";
import { Listing } from "@/types/listing";
import { Card } from "@/components/ui/card";
import { ListingSelector } from "@/components/comparison/ListingSelector";
import { useViewingStore } from "@/store/viewingStore";
import { useVerdictStore } from "@/store/verdictStore";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import {
  CalendarDays,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { calculateScore } from "@/lib/utils/calculateScore";
import { CommuteBadge } from "@/components/distance/CommuteBadge";

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
  compareMode?: boolean;
  onClick?: (id: string) => void;
}

export function ListingCard({ listing, compact, compareMode, onClick }: ListingCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const viewings = useViewingStore((state) => state.viewings);
  const verdicts = useVerdictStore((state) => state.verdicts);
  const evaluation = useEvaluationStore((state) =>
    state.getEvaluationByListingId(listing.id)
  );
  const templates = useTemplateStore((state) => state.templates);

  const viewing = viewings.find((v) => v.listing_id === listing.id);
  const hasVerdict = verdicts.some((v) => v.listing_id === listing.id);
  const isViewingOverdue = !hasVerdict && viewing?.scheduled_date
    ? new Date(viewing.scheduled_date).getTime() + 30 * 60 * 1000 < Date.now()
    : false;
  const template = templates[0];
  const answeredCount = template
    ? template.criteria.filter(
        (criterion) =>
          evaluation?.responses[criterion.id] !== undefined &&
          evaluation.responses[criterion.id] !== ""
      ).length
    : 0;
  const totalCount = template?.criteria.length ?? 0;
  const completionPercent =
    totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const score =
    evaluation && template
      ? calculateScore(evaluation.responses, template, listing.price)
      : null;

  const handleClick = () => {
    onClick?.(listing.id);
  };

  const hasNotes = !!listing.notes;

  if (compact) {
    return (
      <Card
        className="overflow-hidden group cursor-pointer border-border/40 hover:border-primary/30 hover:shadow-sm transition-all duration-200 rounded-lg"
        onClick={handleClick}
      >
        <div className="flex items-center gap-2 px-2.5 py-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0 text-xs">
            {listing.source_url && (
              <a
                href={listing.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 text-muted-foreground/40 hover:text-primary transition-colors"
              >
                <ExternalLink size={10} />
              </a>
            )}
            <span className="font-medium truncate group-hover:text-primary transition-colors">
              {listing.title}
            </span>
            {listing.area && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-muted-foreground/60 truncate shrink-0 max-w-[80px]">
                  {listing.area}
                </span>
              </>
            )}
            <span className="text-muted-foreground/30">·</span>
            <span className="font-semibold text-primary shrink-0">
              ${listing.price.toLocaleString()}
            </span>
            {score !== null && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span
                  className={`shrink-0 font-medium tabular-nums ${
                    score.net > 0
                      ? "text-emerald-600"
                      : score.net < 0
                        ? "text-red-600"
                        : "text-muted-foreground/60"
                  }`}
                >
                  {score.net > 0 ? `+${score.net}` : score.net}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[10px] text-muted-foreground/50">
            {viewing?.scheduled_date ? (
              <span className={isViewingOverdue ? "text-amber-500 font-medium" : ""}>
                {new Date(viewing.scheduled_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            ) : (
              <span className="italic text-muted-foreground/30">No date</span>
            )}
            {hasNotes && <FileText size={10} className="text-muted-foreground/40" />}
            {compareMode && (
              <div onClick={(e) => e.stopPropagation()}>
                <ListingSelector listingId={listing.id} />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`overflow-hidden group cursor-pointer border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-200 rounded-xl ${
        isViewingOverdue ? "border-l-amber-400 border-l-2" : ""
      }`}
      onClick={handleClick}
    >
      <div className="p-3.5 space-y-3">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {listing.title}
            </h3>
            {listing.source_platform && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1">
                {listing.source_platform}
                {listing.source_url && (
                  <a
                    href={listing.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-primary transition-colors"
                  >
                    <ExternalLink size={10} />
                  </a>
                )}
              </p>
            )}
          </div>
          {compareMode && (
            <div
              className="flex flex-col items-end gap-2 shrink-0"
              onClick={(event) => event.stopPropagation()}
            >
              <ListingSelector listingId={listing.id} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-primary">
              ${listing.price.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">/mo</span>
          </div>
        </div>

        {totalCount > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-muted-foreground">
                Evaluation
              </span>
              <span className="font-semibold tabular-nums">
                {answeredCount}/{totalCount}
                {score !== null ? (
                  <span className={score.net > 0 ? "text-emerald-600" : score.net < 0 ? "text-red-600" : ""}>
                    {" "}· {score.net > 0 ? `+${score.net}` : score.net}
                  </span>
                ) : ""}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin size={12} className={!listing.lat ? "opacity-30" : ""} />
            <span className={!listing.lat ? "opacity-40 italic" : ""}>
              {listing.area || "No area"}
              {!listing.lat && " (no map)"}
            </span>
            <CommuteBadge listing={listing} />
          </div>
          <div className="flex items-center gap-2">
            {hasNotes && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowNotes(!showNotes);
                }}
                className="flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
              >
                <FileText size={12} />
                <span>Notes</span>
                {showNotes ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )}
              </button>
            )}
            {viewing?.scheduled_date ? (
              <span className={`text-[10px] ${isViewingOverdue ? "text-amber-500 font-semibold" : "text-muted-foreground/60"}`} title="Scheduled viewing">
                <CalendarDays size={10} className="inline -mt-0.5 mr-0.5" />
                {new Date(viewing.scheduled_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
                {isViewingOverdue && (
                  <span className="ml-1.5 text-[9px] bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5 font-semibold">
                    Overdue
                  </span>
                )}
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground/30 italic">No date set</span>
            )}
          </div>
        </div>

        {showNotes && hasNotes && (
          <div
            className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap"
            onClick={(event) => event.stopPropagation()}
          >
            {listing.notes}
          </div>
        )}
      </div>
    </Card>
  );
}
