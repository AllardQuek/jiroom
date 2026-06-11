"use client";

import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { calculateScore } from "@/lib/utils/calculateScore";
import { Listing } from "@/types/listing";

interface MapTooltipProps {
  listing: Listing;
  x: number;
  y: number;
}

export function MapTooltip({ listing, x, y }: MapTooltipProps) {
  const evaluation = useEvaluationStore((state) =>
    state.getEvaluationByListingId(listing.id)
  );
  const templates = useTemplateStore((state) => state.templates);
  const template = templates[0];
  const score =
    evaluation && template
      ? calculateScore(evaluation.responses, template)
      : null;

  const notesPreview =
    listing.notes && listing.notes.length > 80
      ? listing.notes.slice(0, 80) + "…"
      : listing.notes;

  return (
    <div
      className="fixed z-[2000] bg-background/95 backdrop-blur-sm border border-border/60 rounded-lg shadow-xl px-3 py-2 text-sm pointer-events-none select-none"
      style={{
        left: x,
        top: y - 8,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="font-semibold leading-snug max-w-[200px] truncate">
        {listing.title}
      </div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="font-bold text-base">
          ${listing.price.toLocaleString()}
        </span>
        <span className="text-muted-foreground text-[10px]">/mo</span>
      </div>
      <div className="flex items-center gap-2 mt-0.5">
        {score !== null && (
          <span className="text-xs font-semibold">Score: {score}</span>
        )}
        {listing.area && (
          <span className="text-[10px] text-muted-foreground">
            {listing.area}
          </span>
        )}
      </div>
      {notesPreview && (
        <p className="text-[11px] text-muted-foreground mt-1 leading-tight max-w-[200px] line-clamp-2">
          {notesPreview}
        </p>
      )}
    </div>
  );
}
