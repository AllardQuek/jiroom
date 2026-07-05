"use client";

import { useEffect, useMemo } from "react";
import { useComparisonStore } from "@/store/comparisonStore";
import { useListingStore } from "@/store/listingStore";
import { useTemplateStore } from "@/store/templateStore";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useVerdictStore } from "@/store/verdictStore";
import { useViewingStore } from "@/store/viewingStore";
import { ComparisonMatrix } from "./ComparisonMatrix";
import { calculateScore } from "@/lib/utils/calculateScore";
import { getDisplayPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GitCompareArrows, X, LayoutList } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function ComparisonTable() {
  const t = useTranslations("compare");
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const selectedListingIds = useComparisonStore((s) => s.selectedListingIds);
  const clearComparison = useComparisonStore((s) => s.clearComparison);
  const removeFromComparison = useComparisonStore(
    (s) => s.removeFromComparison
  );
  const listings = useListingStore((s) => s.listings);
  const templates = useTemplateStore((s) => s.templates);
  const evaluations = useEvaluationStore((s) => s.evaluations);
  const verdicts = useVerdictStore((s) => s.verdicts);
  const viewings = useViewingStore((s) => s.viewings);

  const selectedListings = useMemo(
    () => listings.filter((l) => selectedListingIds.includes(l.id)),
    [listings, selectedListingIds]
  );

  const template = templates[0];

  const getScore = (listingId: string) => {
    const evaluation = evaluations.find((e) => e.listing_id === listingId);
    const listing = listings.find((l) => l.id === listingId);
    if (!evaluation || !template) return null;
    const displayPrice = listing
      ? getDisplayPrice(listing, evaluation)
      : undefined;
    return calculateScore(evaluation.responses, template, displayPrice);
  };

  const scores = useMemo(
    () => selectedListings.map((l) => getScore(l.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedListings, evaluations, template]
  );

  if (selectedListings.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="bg-muted p-6 rounded-full">
          <GitCompareArrows size={48} className="text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{t("noSelection")}</h2>
          <p className="text-muted-foreground max-w-xs">
            {t("selectListings")}
          </p>
        </div>
        <Link href="/listings">
          <Button variant="outline">
            <LayoutList className="h-4 w-4 mr-1.5" />
            {tNav("listings")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      <header className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {selectedListings.length > 1
              ? t("listingsCount", { count: selectedListings.length })
              : t("listingCount", { count: selectedListings.length })}{" "}
            &middot;{" "}
            {t("criteriaCount", { count: template?.criteria.length ?? 0 })}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={clearComparison}>
            <X size={14} className="mr-1" />
            {tCommon("close")}
          </Button>
        </div>
      </header>

      <ComparisonMatrix
        listings={selectedListings}
        template={template}
        evaluations={evaluations}
        verdicts={verdicts}
        viewings={viewings}
        scores={scores}
        onRemove={removeFromComparison}
      />
    </div>
  );
}
