"use client";

import { useEffect } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { useListingStore } from "@/store/listingStore";
import { Criterion, Evaluation, Template } from "@/types/evaluation";
import { calculateScore as calcScore } from "@/lib/utils/calculateScore";
import { hasResponse, groupCriteriaByCategory } from "./shared/evaluationHelpers";
import { SelectPills, NumberBadge, TextNote } from "./shared/EvaluationInputs";
import { useDerivedTotal } from "./shared/useDerivedTotal";

interface EvaluationSectionProps {
  listingId: string;
}

export function EvaluationSection({ listingId }: EvaluationSectionProps) {
  const templates = useTemplateStore((state) => state.templates);
  const listings = useListingStore((state) => state.listings);
  const evaluation = useEvaluationStore((state) =>
    state.getEvaluationByListingId(listingId)
  );
  const addEvaluation = useEvaluationStore((state) => state.addEvaluation);
  const updateEvaluation = useEvaluationStore(
    (state) => state.updateEvaluation
  );
  const deleteEvaluation = useEvaluationStore(
    (state) => state.deleteEvaluation
  );

  const template = templates[0];
  const listing = listings.find((l) => l.id === listingId);

  if (!template) {
    return (
      <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
        Set up an evaluation template before rating this listing.
      </div>
    );
  }

  const responses = evaluation?.responses ?? {};
  const listingPrice = listing?.negotiated_price ?? listing?.price;
  const score = evaluation ? calcScore(responses, template, listingPrice) : null;

  const answeredCount = template.criteria.filter((criterion) => {
    if (criterion.type === "derived") {
      return listingPrice !== undefined || criterion.derivedFrom?.some((id) => hasResponse(responses[id]));
    }
    return hasResponse(responses[criterion.id]);
  }).length;
  const totalCount = template.criteria.length;
  const completionPercent =
    totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const groupedCriteria = groupCriteriaByCategory(template);

  const derivedCriterion = template.criteria.find((c) => c.type === "derived");
  const derivedTotal = useDerivedTotal(derivedCriterion, listingPrice, responses);

  const saveResponse = (criterionId: string, value: number | string) => {
    const now = new Date().toISOString();
    
    // Calculate derived total (c0) when saving cost fields (c2 or c4)
    let updatedResponses: Record<string, number | string>;
    if (criterionId === "c2" || criterionId === "c4") {
      const utilityCost = criterionId === "c2" ? Number(value || 0) : Number(evaluation?.responses["c2"] || 0);
      const additionalCost = criterionId === "c4" ? Number(value || 0) : Number(evaluation?.responses["c4"] || 0);
      const totalCost = (listingPrice || 0) + utilityCost + additionalCost;
      
      if (evaluation) {
        updatedResponses = { ...evaluation.responses, [criterionId]: value, c0: totalCost };
      } else {
        updatedResponses = { [criterionId]: value, c0: totalCost };
      }
    } else {
      if (evaluation) {
        updatedResponses = { ...evaluation.responses, [criterionId]: value };
      } else {
        updatedResponses = { [criterionId]: value };
      }
    }
    
    if (evaluation) {
      updateEvaluation(evaluation.id, {
        responses: updatedResponses,
        updated_at: now,
      });
      return;
    }
    const newEvaluation: Evaluation = {
      id: crypto.randomUUID(),
      listing_id: listingId,
      template_id: template.id,
      responses: updatedResponses,
      created_at: now,
      updated_at: now,
    };
    addEvaluation(newEvaluation);
  };

  const clearResponse = (criterionId: string) => {
    if (!evaluation) return;
    const nextResponses = { ...evaluation.responses };
    delete nextResponses[criterionId];
    
    // Recalculate c0 when clearing cost fields (c2 or c4)
    if (criterionId === "c2" || criterionId === "c4") {
      const utilityCost = Number(evaluation.responses["c2"] || 0);
      const additionalCost = Number(evaluation.responses["c4"] || 0);
      const totalCost = (listingPrice || 0) + utilityCost + additionalCost;
      
      // Only include c0 if there are still costs
      if (utilityCost > 0 || additionalCost > 0) {
        nextResponses["c0"] = totalCost;
      } else {
        delete nextResponses["c0"];
      }
    }
    
    if (Object.keys(nextResponses).length === 0) {
      deleteEvaluation(evaluation.id);
      return;
    }
    updateEvaluation(evaluation.id, {
      responses: nextResponses,
      updated_at: new Date().toISOString(),
    });
  };

  const renderInput = (criterion: Criterion) => {
    const value = responses[criterion.id];

    switch (criterion.type) {
      case "derived":
        return (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold tabular-nums text-foreground/80">
              {derivedTotal !== null ? `$${derivedTotal.toLocaleString()}` : "—"}
            </span>
          </div>
        );
      case "checkbox":
        return (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                value === "true"
                  ? clearResponse(criterion.id)
                  : saveResponse(criterion.id, "true")
              }
              className={`h-6 rounded-full px-2.5 text-[11px] font-medium transition-all duration-150 leading-none border ${
                value === "true"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs"
                  : "bg-transparent text-muted-foreground/60 border-border/30 hover:border-border/60 hover:text-foreground/80"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() =>
                value === "false"
                  ? clearResponse(criterion.id)
                  : saveResponse(criterion.id, "false")
              }
              className={`h-6 rounded-full px-2.5 text-[11px] font-medium transition-all duration-150 leading-none border ${
                value === "false"
                  ? "bg-red-50 text-red-700 border-red-200 shadow-xs"
                  : "bg-transparent text-muted-foreground/60 border-border/30 hover:border-border/60 hover:text-foreground/80"
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() =>
                value === "na"
                  ? clearResponse(criterion.id)
                  : saveResponse(criterion.id, "na")
              }
              className={`h-6 rounded-full px-2.5 text-[11px] font-medium transition-all duration-150 leading-none border ${
                value === "na"
                  ? "bg-muted text-muted-foreground border-border/40 shadow-xs"
                  : "bg-transparent text-muted-foreground/40 border-transparent hover:text-muted-foreground/70"
              }`}
            >
              N/A
            </button>
          </div>
        );
      case "rating":
        return (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() =>
                  value === rating
                    ? clearResponse(criterion.id)
                    : saveResponse(criterion.id, rating)
                }
                className={`h-6 w-6 flex items-center justify-center rounded-full text-[11px] font-medium transition-all duration-150 leading-none ${
                  value === rating
                    ? "bg-primary/10 text-primary border border-primary/30 shadow-xs"
                    : "text-muted-foreground/40 hover:text-muted-foreground/70 hover:bg-muted/50"
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );
      case "number":
        return (
          <NumberBadge
            value={value}
            onChange={(v) => saveResponse(criterion.id, v)}
            onClear={() => clearResponse(criterion.id)}
          />
        );
      case "select":
        return (
          <SelectPills
            options={criterion.options ?? []}
            scores={criterion.scores}
            value={typeof value === "string" ? value : undefined}
            onChange={(v) => saveResponse(criterion.id, v)}
            onClear={() => clearResponse(criterion.id)}
          />
        );
      case "text":
      default:
        return (
          <TextNote
            value={typeof value === "string" ? value : undefined}
            onChange={(v) => saveResponse(criterion.id, v)}
            onClear={() => clearResponse(criterion.id)}
          />
        );
    }
  };

  return (
    <div className="rounded-xl bg-muted/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Evaluation</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {answeredCount}/{totalCount}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span>{completionPercent}%</span>
          {score !== null && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className={`font-medium tabular-nums ${
                score.net > 0 ? "text-emerald-600" : score.net < 0 ? "text-red-600" : "text-muted-foreground"
              }`}>
                {score.net > 0 ? `+${score.net}` : score.net}
              </span>
            </>
          )}
        </div>
      </div>

      {Object.entries(groupedCriteria).map(([category, criteria]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {category}
            </span>
            <span className="h-px flex-1 bg-border/50" />
            <span className="text-xs text-muted-foreground">
              {criteria.filter((c) => {
                if (c.type === "derived") return derivedTotal !== null;
                return hasResponse(responses[c.id]);
              }).length}
              /{criteria.length}
            </span>
          </div>

          <div className="space-y-0.5">
            {criteria.map((criterion) => {
              const answered = criterion.type === "derived"
                ? derivedTotal !== null
                : hasResponse(responses[criterion.id]);
              return (
                <div
                  key={criterion.id}
                  className="group flex items-start gap-3 rounded-lg px-3 py-1.5 transition-colors hover:bg-background/60"
                >
                  <div className="mt-1 shrink-0 w-3">
                    {answered && <Check className="h-3 w-3 text-emerald-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-sm font-medium leading-snug">
                          {criterion.name}
                        </span>
                        {criterion.description && (
                          <span className="ml-1.5 text-xs text-muted-foreground/50">
                            {criterion.description}
                          </span>
                        )}
                      </div>
                      <div
                        className="shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {renderInput(criterion)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
