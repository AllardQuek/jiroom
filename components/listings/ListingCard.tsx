"use client";

import { Listing } from "@/types/listing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ListingSelector } from "@/components/comparison/ListingSelector";
import { useViewingStore } from "@/store/viewingStore";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { CalendarDays, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { calculateScore } from "@/lib/utils/calculateScore";

interface ListingCardProps {
  listing: Listing;
}

const statusColors: Record<string, string> = {
  new: "bg-slate-100 text-slate-700 border-slate-200",
  to_view: "bg-blue-50 text-blue-700 border-blue-200",
  viewed: "bg-green-50 text-green-700 border-green-200",
  archived: "bg-gray-100 text-gray-500 border-gray-200",
  shortlisted: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const statusLabels: Record<string, string> = {
  new: "New",
  to_view: "To View",
  viewed: "Viewed",
  archived: "Archived",
  shortlisted: "Shortlisted",
};

export function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter();
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
    router.push(`/listings/${listing.id}`);
  };

  const statusColor = statusColors[listing.status] || "bg-gray-100";
  const statusLabel = statusLabels[listing.status] || listing.status;

  return (
    <Card
      className="overflow-hidden group cursor-pointer border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 rounded-xl"
      onClick={handleClick}
    >
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 flex-1">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {listing.title}
            </h3>
            {listing.source_platform && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
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
            <span className="text-2xl font-black text-primary">
              ${listing.price.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              /month
            </span>
          </div>

          <Badge
            variant="outline"
            className={`${statusColor} font-bold border px-2 py-0.5 rounded-md`}
          >
            {statusLabel}
          </Badge>
        </div>

        {viewing?.scheduled_date && (
          <div className="bg-primary/5 rounded-lg p-3 flex items-center gap-3 border border-primary/10">
            <div className="bg-primary/10 p-2 rounded-md text-primary">
              <CalendarDays size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase leading-none mb-1">
                Upcoming Viewing
              </span>
              <span className="text-xs font-semibold">
                {format(parseISO(viewing.scheduled_date), "MMM d, h:mm aa")}
              </span>
            </div>
          </div>
        )}

        {totalCount > 0 && (
          <div className="space-y-2 rounded-lg border border-border/50 bg-muted/20 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">
                Evaluation
              </span>
              <span className="font-bold">
                {answeredCount}/{totalCount}
                {score !== null ? ` · ${score}/100` : ""}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <MapPin size={12} />
            <span>{listing.area || "Location not set"}</span>
          </div>
          <p className="text-[10px] text-muted-foreground/60 italic">
            Added {new Date(listing.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
