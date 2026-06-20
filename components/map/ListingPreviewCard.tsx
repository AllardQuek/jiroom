import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { useVerdictStore } from "@/store/verdictStore";
import { calculateScore } from "@/lib/utils/calculateScore";
import { STATUS_COLORS, VERDICT_STYLES, getStatusColors, getVerdictStyles } from "@/lib/constants/colors";
import { Listing } from "@/types/listing";
import { Eye, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface ListingPreviewCardProps {
  listing: Listing;
  onViewDetails?: (id: string) => void;
}

/**
 * A compact preview card for listing details displayed in the map view.
 * This component shows key information about a listing including title, price,
 * status/verdict badge, evaluation score, notes, and action buttons.
 *
 * @param listing - The listing to display
 * @param onViewDetails - Optional callback when the details button is clicked
 * @returns A compact listing preview card
 *
 * @example
 * ```tsx
 * <ListingPreviewCard
 *   listing={selectedListing}
 *   onViewDetails={(id) => navigate(`/listings/${id}`)}
 * />
 * ```
 */
export function ListingPreviewCard({ listing, onViewDetails }: ListingPreviewCardProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const resolvedTheme = (theme as 'light' | 'dark') || 'light';

  useEffect(() => {
    setMounted(true);
  }, []);

  const evaluation = useEvaluationStore((state) =>
    state.getEvaluationByListingId(listing.id)
  );
  const templates = useTemplateStore((state) => state.templates);
  const template = templates[0];
  const score =
    evaluation && template
      ? calculateScore(evaluation.responses, template)
      : null;
  const verdict = useVerdictStore((s) =>
    s.verdicts.find((v) => v.listing_id === listing.id)
  );
  const statusColors = mounted ? getStatusColors(resolvedTheme) : STATUS_COLORS;
  const verdictStyles = mounted ? getVerdictStyles(resolvedTheme) : VERDICT_STYLES;
  const verdictStyle = verdict ? verdictStyles[verdict.status] : null;

  return (
    <div className="text-sm min-w-[180px] max-w-[260px]">
      <div className="space-y-0.5">
        <h3
          className="font-semibold leading-tight text-[12px]"
          style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
        >
          {listing.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">
            ${listing.price.toLocaleString()}
          </span>
          <span
            className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: verdictStyle
                ? verdictStyle.bg
                : STATUS_COLORS[listing.status] + "20",
              color: verdictStyle
                ? verdictStyle.fg
                : STATUS_COLORS[listing.status],
            }}
          >
            {verdictStyle ? verdictStyle.label : listing.status.replace("_", " ")}
          </span>
          {score !== null && (
            <span
              className={`text-[11px] font-semibold tabular-nums ${
                score.net > 0
                  ? "text-emerald-600"
                  : score.net < 0
                    ? "text-red-600"
                    : ""
              }`}
            >
              {score.net > 0 ? `+${score.net}` : score.net}
            </span>
          )}
        </div>
        {listing.notes && (
          <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-wrap">
            {listing.notes}
          </p>
        )}
      </div>
      <div className="flex gap-1.5 mt-2 pt-2 border-t border-border/40">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(listing.id)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Eye size={10} />
            Details
          </button>
        )}
        <a
          href={listing.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
        >
          <ExternalLink size={10} />
          Source
        </a>
      </div>
    </div>
  );
}
