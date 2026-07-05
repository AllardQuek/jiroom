import { Listing } from "@/types/listing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, Trash2 } from "lucide-react";
import { useEvaluationStore } from "@/store/evaluationStore";
import { getDisplayPrice } from "@/lib/utils";
import { useLocale } from "next-intl";

interface ListingDetailProps {
  listing: Listing;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusColors: Record<string, string> = {
  new: "bg-amber-100 text-amber-800 border-amber-200",
  to_view: "bg-blue-100 text-blue-800 border-blue-200",
  viewed: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const statusLabels: Record<string, string> = {
  new: "New",
  to_view: "To View",
  viewed: "Viewed",
};

export function ListingDetail({
  listing,
  onEdit,
  onDelete,
}: ListingDetailProps) {
  const locale = useLocale();
  const statusColor =
    statusColors[listing.status] || "bg-stone-100 text-stone-500";
  const statusLabel = statusLabels[listing.status] || listing.status;
  const evaluation = useEvaluationStore((state) =>
    state.getEvaluationByListingId(listing.id)
  );
  const displayPrice = getDisplayPrice(listing, evaluation);
  const isNegotiated = listing.negotiated_price !== undefined;

  return (
    <div className="space-y-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold leading-snug">
            {listing.title}
          </h2>
          <Badge
            variant="outline"
            className={`shrink-0 font-medium ${statusColor}`}
          >
            {statusLabel}
          </Badge>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {listing.source_platform || "No source"}
        </p>
      </div>

      <div className="flex items-baseline gap-1">
        <span
          className={`text-3xl font-bold tracking-tight ${isNegotiated ? "text-emerald-600" : "text-primary"}`}
        >
          ${displayPrice.toLocaleString()}
        </span>
        <span className="text-sm text-muted-foreground">/month</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
        {listing.area && (
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            {listing.area}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          Added {new Date(listing.created_at).toLocaleDateString(locale)}
        </span>
      </div>

      {listing.source_url && (
        <button
          type="button"
          onClick={() => window.open(listing.source_url, "_blank")}
          className="inline-flex items-center gap-1.5 text-sm text-primary/80 hover:text-primary transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View source
        </button>
      )}

      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          className="h-8 gap-1.5"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="h-8 gap-1.5 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}
