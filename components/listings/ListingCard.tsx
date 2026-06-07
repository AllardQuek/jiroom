"use client";

import { useState } from "react";
import { Listing } from "@/types/listing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListingSelector } from "@/components/comparison/ListingSelector";
import { useViewingStore } from "@/store/viewingStore";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import {
  CalendarDays,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { calculateScore } from "@/lib/utils/calculateScore";

interface ListingCardProps {
  listing: Listing;
  onClick?: (id: string) => void;
}

const statusColors: Record<string, string> = {
  new: "bg-amber-100 text-amber-800 border-amber-200",
  to_view: "bg-blue-100 text-blue-800 border-blue-200",
  viewed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  archived: "bg-stone-100 text-stone-500 border-stone-200",
  shortlisted: "bg-violet-100 text-violet-800 border-violet-200",
};

const statusLabels: Record<string, string> = {
  new: "New",
  to_view: "To View",
  viewed: "Viewed",
  archived: "Archived",
  shortlisted: "Shortlisted",
};

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const viewings = useViewingStore((state) => state.viewings);
  const evaluation = useEvaluationStore((state) =>
    state.getEvaluationByListingId(listing.id)
  );
  const templates = useTemplateStore((state) => state.templates);

  const viewing = viewings.find((v) => v.listing_id === listing.id);
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
      ? calculateScore(evaluation.responses, template)
      : null;

  const handleClick = () => {
    onClick?.(listing.id);
  };

  const statusColor =
    statusColors[listing.status] || "bg-stone-100 text-stone-500";
  const statusLabel = statusLabels[listing.status] || listing.status;

  const hasNotes = !!listing.notes;

  return (
    <Card
      className="overflow-hidden group cursor-pointer border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-200 rounded-xl"
      onClick={handleClick}
    >
      <div className="p-3.5 space-y-3">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {listing.title}
            </h3>
            {listing.source_platform && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {listing.source_platform}
              </p>
            )}
          </div>
          <div
            className="flex flex-col items-end gap-2 shrink-0"
            onClick={(event) => event.stopPropagation()}
          >
            <ListingSelector listingId={listing.id} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-primary">
              ${listing.price.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">/mo</span>
          </div>

          <Badge
            variant="outline"
            className={`font-medium border px-2 py-0.5 rounded-md text-xs ${statusColor}`}
          >
            {statusLabel}
          </Badge>
        </div>

        {viewing?.scheduled_date && (
          <div className="bg-primary/5 rounded-lg p-2.5 flex items-center gap-2.5">
            <div className="bg-primary/10 p-1.5 rounded-md text-primary">
              <CalendarDays size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-primary uppercase leading-none mb-0.5">
                Upcoming Viewing
              </span>
              <span className="text-xs font-medium">
                {format(parseISO(viewing.scheduled_date), "MMM d, h:mm aa")}
              </span>
            </div>
          </div>
        )}

        {totalCount > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-muted-foreground">
                Evaluation
              </span>
              <span className="font-semibold">
                {answeredCount}/{totalCount}
                {score !== null ? ` · ${score}` : ""}
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
            <MapPin size={12} />
            <span>{listing.area || "No area"}</span>
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
            <p className="text-[10px] text-muted-foreground/40">
              {new Date(listing.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {showNotes && hasNotes && (
          <div
            className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground"
            onClick={(event) => event.stopPropagation()}
          >
            {listing.notes}
          </div>
        )}
      </div>
    </Card>
  );
}
