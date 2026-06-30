"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { useTemplateStore } from "@/store/templateStore";
import { Criterion, Template } from "@/types/evaluation";
import { calculateScore as calcScore } from "@/lib/utils/calculateScore";
import { hasResponse, groupCriteriaByCategory } from "./shared/evaluationHelpers";
import { SelectPills, NumberBadge, TextNote } from "./shared/EvaluationInputs";
import { useDerivedTotal } from "./shared/useDerivedTotal";
import { useTranslations } from 'next-intl';

interface InlineEvaluationProps {
  responses: Record<string, number | string>;
  onResponse: (criterionId: string, value: number | string) => void;
  onClearResponse: (criterionId: string) => void;
  listingPrice?: number;
}

export function InlineEvaluation({
  responses,
  onResponse,
  onClearResponse,
  listingPrice,
}: InlineEvaluationProps) {
  const t = useTranslations('evaluation');
  const templates = useTemplateStore((state) => state.templates);

  const template = templates[0];

  if (!template) {
    return (
      <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
        {t('noTemplate')}
      </div>
    );
  }

  const score = Object.keys(responses).length > 0
    ? calcScore(responses, template, listingPrice)
    : null;

  const answeredCount = template.criteria.filter((criterion) => {
    if (criterion.type === "derived") {
      return listingPrice !== undefined || criterion.derivedFrom?.some((id) => hasResponse(responses[id]));
    }
    return hasResponse(responses[criterion.id]);
  }).length;
  const totalCount = template.criteria.length;
  const groupedCriteria = groupCriteriaByCategory(template);

  const derivedCriterion = template.criteria.find((c) => c.type === "derived");
  const derivedTotal = useDerivedTotal(derivedCriterion, listingPrice, responses);

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
                  ? onClearResponse(criterion.id)
                  : onResponse(criterion.id, "true")
              }
              className={`h-6 rounded-full px-2.5 text-[11px] font-medium transition-all duration-150 leading-none border ${
                value === "true"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs"
                  : "bg-transparent text-muted-foreground/60 border-border/30 hover:border-border/60 hover:text-foreground/80"
              }`}
            >
              {t('yes')}
            </button>
            <button
              type="button"
              onClick={() =>
                value === "false"
                  ? onClearResponse(criterion.id)
                  : onResponse(criterion.id, "false")
              }
              className={`h-6 rounded-full px-2.5 text-[11px] font-medium transition-all duration-150 leading-none border ${
                value === "false"
                  ? "bg-red-50 text-red-700 border-red-200 shadow-xs"
                  : "bg-transparent text-muted-foreground/60 border-border/30 hover:border-border/60 hover:text-foreground/80"
              }`}
            >
              {t('no')}
            </button>
            <button
              type="button"
              onClick={() =>
                value === "na"
                  ? onClearResponse(criterion.id)
                  : onResponse(criterion.id, "na")
              }
              className={`h-6 rounded-full px-2.5 text-[11px] font-medium transition-all duration-150 leading-none border ${
                value === "na"
                  ? "bg-muted text-muted-foreground border-border/40 shadow-xs"
                  : "bg-transparent text-muted-foreground/40 border-transparent hover:text-muted-foreground/70"
              }`}
            >
              {t('na')}
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
                    ? onClearResponse(criterion.id)
                    : onResponse(criterion.id, rating)
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
            onChange={(v) => onResponse(criterion.id, v)}
            onClear={() => onClearResponse(criterion.id)}
          />
        );
      case "select":
        return (
          <SelectPills
            options={criterion.options ?? []}
            scores={criterion.scores}
            value={typeof value === "string" ? value : undefined}
            onChange={(v) => onResponse(criterion.id, v)}
            onClear={() => onClearResponse(criterion.id)}
          />
        );
      case "text":
      default:
        return (
          <TextNote
            value={typeof value === "string" ? value : undefined}
            onChange={(v) => onResponse(criterion.id, v)}
            onClear={() => onClearResponse(criterion.id)}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{t('title')}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {answeredCount}/{totalCount}
          </span>
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
                  className="group flex items-start gap-3 rounded-lg px-3 py-1.5 transition-colors hover:bg-muted/30"
                >
                  <div className="self-center shrink-0 w-3">
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
                      <div className="shrink-0">
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
