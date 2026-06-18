"use client";

import { useEffect, useMemo } from "react";
import { Check, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import { useTemplateStore } from "@/store/templateStore";
import { Criterion, Template } from "@/types/evaluation";
import { calculateScore as calcScore } from "@/lib/utils/calculateScore";

interface InlineEvaluationProps {
  responses: Record<string, number | string>;
  onResponse: (criterionId: string, value: number | string) => void;
  onClearResponse: (criterionId: string) => void;
  listingPrice?: number;
}

const hasResponse = (value: number | string | undefined) =>
  value !== undefined && value !== "";

const groupCriteriaByCategory = (template: Template) =>
  template.criteria.reduce(
    (groups, criterion) => {
      if (!groups[criterion.category]) {
        groups[criterion.category] = [];
      }
      groups[criterion.category].push(criterion);
      return groups;
    },
    {} as Record<string, Criterion[]>
  );

function SelectPills({
  options,
  scores,
  value,
  onChange,
  onClear,
}: {
  options: string[];
  scores?: Record<string, -1 | 0 | 1>;
  value: string | undefined;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center flex-wrap gap-1 min-w-0 max-w-[180px] justify-end">
      {options.map((option) => {
        const selected = value === option;
        const score = scores?.[option] ?? 0;
        return (
          <button
            key={option}
            type="button"
            onClick={() => (selected ? onClear() : onChange(option))}
            className={`
              h-6 rounded-full px-2.5 text-[11px] font-medium
              transition-all duration-150 leading-none
              ${
                selected
                  ? score === 1
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs"
                      : score === -1
                        ? "bg-red-50 text-red-700 border-red-200 shadow-xs"
                        : "bg-primary/10 text-primary border-primary/30 shadow-xs"
                  : "bg-transparent text-muted-foreground/60 border border-border/30 hover:border-border/60 hover:text-foreground/80"
              }
            `}
            style={selected ? { borderWidth: 1 } : { borderWidth: 1 }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function NumberBadge({
  value,
  onChange,
  onClear,
}: {
  value: number | string | undefined;
  onChange: (value: number) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted/80 text-[10px] text-muted-foreground/60 font-medium">
        <Hash className="h-2.5 w-2.5" />
      </span>
      <Input
        type="number"
        value={typeof value === "number" ? value : ""}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue === "") {
            onClear();
            return;
          }
          onChange(Number(nextValue));
        }}
        className="h-7 w-[72px] text-xs rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        placeholder="..."
      />
    </div>
  );
}

function TextNote({
  value,
  onChange,
  onClear,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  const hasContent = value !== undefined && value !== "";
  return (
    <div className="relative">
      <AutoResizeTextarea
        value={typeof value === "string" ? value : ""}
        onChange={(event) => {
          if (event.target.value === "") {
            onClear();
            return;
          }
          onChange(event.target.value);
        }}
        placeholder="..."
        className={`
          text-xs py-2 rounded-lg
          transition-all duration-150
          ${hasContent
            ? "bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/40 dark:border-amber-800/30"
            : "border-dashed border-border/40"
          }
        `}
      />
    </div>
  );
}

export function InlineEvaluation({
  responses,
  onResponse,
  onClearResponse,
  listingPrice,
}: InlineEvaluationProps) {
  const templates = useTemplateStore((state) => state.templates);
  const initializeTemplates = useTemplateStore(
    (state) => state.initializeTemplates
  );

  useEffect(() => {
    initializeTemplates();
  }, [initializeTemplates]);

  const template = templates[0];

  if (!template) {
    return (
      <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
        No evaluation template found. Create one in Settings first.
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
  const derivedTotal = useMemo(() => {
    if (!derivedCriterion || listingPrice === undefined) return null;
    let total = listingPrice;
    if (derivedCriterion.derivedFrom) {
      for (const depId of derivedCriterion.derivedFrom) {
        const depResponse = responses[depId];
        if (depResponse !== undefined && depResponse !== "") {
          total += Number(depResponse) || 0;
        }
      }
    }
    return total;
  }, [derivedCriterion, listingPrice, responses]);

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
              Yes
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
              No
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
        <span className="text-sm font-medium">Evaluation</span>
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
