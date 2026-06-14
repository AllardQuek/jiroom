"use client";

import { useState, useEffect, useMemo } from "react";
import { useComparisonStore } from "@/store/comparisonStore";
import { useListingStore } from "@/store/listingStore";
import { useTemplateStore } from "@/store/templateStore";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useVerdictStore } from "@/store/verdictStore";
import { useViewingStore } from "@/store/viewingStore";
import { ComparisonColumn } from "./ComparisonColumn";
import { calculateScore, ScoreResult } from "@/lib/utils/calculateScore";
import { Button } from "@/components/ui/button";
import { GitCompareArrows, X, ChevronDown, LayoutList } from "lucide-react";
import Link from "next/link";

export function ComparisonTable() {
  const selectedListingIds = useComparisonStore((s) => s.selectedListingIds);
  const clearComparison = useComparisonStore((s) => s.clearComparison);
  const removeFromComparison = useComparisonStore(
    (s) => s.removeFromComparison
  );
  const listings = useListingStore((s) => s.listings);
  const templates = useTemplateStore((s) => s.templates);
  const initializeTemplates = useTemplateStore((s) => s.initializeTemplates);
  const evaluations = useEvaluationStore((s) => s.evaluations);
  const verdicts = useVerdictStore((s) => s.verdicts);
  const viewings = useViewingStore((s) => s.viewings);

  const [showCriteria, setShowCriteria] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    initializeTemplates();
  }, [initializeTemplates]);

  const selectedListings = useMemo(
    () => listings.filter((l) => selectedListingIds.includes(l.id)),
    [listings, selectedListingIds]
  );

  const template = templates[0];

  const categories = useMemo(() => {
    if (!template) return [];
    return [...new Set(template.criteria.map((c) => c.category))];
  }, [template]);

  const getScore = (listingId: string) => {
    const evaluation = evaluations.find((e) => e.listing_id === listingId);
    const listing = listings.find((l) => l.id === listingId);
    if (!evaluation || !template) return null;
    return calculateScore(evaluation.responses, template, listing?.price);
  };

  const scores = useMemo(
    () => selectedListings.map((l) => getScore(l.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedListings, evaluations, template]
  );
  const bestNet = Math.max(
    ...scores.filter((s): s is ScoreResult => s !== null).map((s) => s.net),
    -Infinity
  );

  if (selectedListings.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="bg-muted p-6 rounded-full">
          <GitCompareArrows size={48} className="text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">No listings selected</h2>
          <p className="text-muted-foreground max-w-xs">
            Select 2–3 listings from your board to compare them side by side.
          </p>
        </div>
        <Link href="/listings">
          <Button variant="outline">
            <LayoutList className="h-4 w-4 mr-1.5" />
            Browse Listings
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-4 pr-14">
      <style>{`
        @keyframes cmp-fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cmp-reveal {
          animation: cmp-fade-in 0.2s ease-out both;
        }
        .cmp-column-enter {
          animation: cmp-fade-in 0.35s ease-out both;
        }
        .cmp-column-enter:nth-child(1) { animation-delay: 0.03s; }
        .cmp-column-enter:nth-child(2) { animation-delay: 0.07s; }
        .cmp-column-enter:nth-child(3) { animation-delay: 0.11s; }
      `}</style>

      <header className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold">Compare</h1>
          <p className="text-sm text-muted-foreground">
            {selectedListings.length} listing
            {selectedListings.length > 1 ? "s" : ""} &middot;{" "}
            {template?.criteria.length ?? 0} criteria
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {template && (
            <Button
              variant={showCriteria ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCriteria(!showCriteria)}
            >
              <ChevronDown
                size={14}
                className={`mr-1 transition-transform duration-200 ${
                  showCriteria ? "rotate-180" : ""
                }`}
              />
              Criteria
            </Button>
          )}

          {showCriteria && categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          <Button variant="outline" size="sm" onClick={clearComparison}>
            <X size={14} className="mr-1" />
            Clear
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
        {selectedListings.map((listing, index) => (
          <div key={listing.id} className="cmp-column-enter">
            <ComparisonColumn
              listing={listing}
              template={template}
              evaluation={evaluations.find((e) => e.listing_id === listing.id)}
              verdict={
                verdicts.find((v) => v.listing_id === listing.id) ?? null
              }
              viewing={
                viewings.find((v) => v.listing_id === listing.id) ?? null
              }
              score={scores[index]}
              isWinner={scores[index] !== null && scores[index]!.net === bestNet && bestNet > 0}
              showCriteria={showCriteria}
              categoryFilter={categoryFilter}
              onRemove={() => removeFromComparison(listing.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
