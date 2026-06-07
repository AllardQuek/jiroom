"use client";

import { useEffect } from "react";
import { Check, Circle, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { Criterion, Evaluation, Template } from "@/types/evaluation";
import { calculateScore } from "@/lib/utils/calculateScore";

interface EvaluationSectionProps {
  listingId: string;
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

export function EvaluationSection({ listingId }: EvaluationSectionProps) {
  const templates = useTemplateStore((state) => state.templates);
  const initializeTemplates = useTemplateStore(
    (state) => state.initializeTemplates
  );
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

  useEffect(() => {
    initializeTemplates();
  }, [initializeTemplates]);

  const template = templates[0];

  if (!template) {
    return (
      <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
        Set up an evaluation template before rating this listing.
      </div>
    );
  }

  const responses = evaluation?.responses ?? {};
  const answeredCount = template.criteria.filter((criterion) =>
    hasResponse(responses[criterion.id])
  ).length;
  const totalCount = template.criteria.length;
  const completionPercent =
    totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const score = evaluation ? calculateScore(responses, template) : null;
  const groupedCriteria = groupCriteriaByCategory(template);

  const saveResponse = (criterionId: string, value: number | string) => {
    const now = new Date().toISOString();
    if (evaluation) {
      updateEvaluation(evaluation.id, {
        responses: { ...evaluation.responses, [criterionId]: value },
        updated_at: now,
      });
      return;
    }
    const newEvaluation: Evaluation = {
      id: crypto.randomUUID(),
      listing_id: listingId,
      template_id: template.id,
      responses: { [criterionId]: value },
      created_at: now,
      updated_at: now,
    };
    addEvaluation(newEvaluation);
  };

  const clearResponse = (criterionId: string) => {
    if (!evaluation) return;
    const nextResponses = { ...evaluation.responses };
    delete nextResponses[criterionId];
    if (Object.keys(nextResponses).length === 0) {
      deleteEvaluation(evaluation.id);
      return;
    }
    updateEvaluation(evaluation.id, {
      responses: nextResponses,
      updated_at: new Date().toISOString(),
    });
  };

  const renderInput = (criterion: Criterion, compact: boolean) => {
    const value = responses[criterion.id];

    if (compact) {
      switch (criterion.type) {
        case "checkbox":
          return (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => saveResponse(criterion.id, "true")}
                className={`h-7 rounded-md px-2.5 text-xs font-medium transition-colors ${
                  value === "true"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => saveResponse(criterion.id, "false")}
                className={`h-7 rounded-md px-2.5 text-xs font-medium transition-colors ${
                  value === "false"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => saveResponse(criterion.id, "na")}
                className={`h-7 rounded-md px-2.5 text-xs font-medium transition-colors ${
                  value === "na"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
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
                  onClick={() => saveResponse(criterion.id, rating)}
                  className={`h-7 w-7 flex items-center justify-center rounded-md text-xs transition-colors ${
                    value === rating
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          );
        case "number":
          return (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={typeof value === "number" ? value : ""}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  if (nextValue === "") {
                    clearResponse(criterion.id);
                    return;
                  }
                  saveResponse(criterion.id, Number(nextValue));
                }}
                className="h-7 w-20 text-xs"
                placeholder="..."
              />
            </div>
          );
        case "select":
          return (
            <Select
              value={typeof value === "string" ? value : ""}
              onValueChange={(selectedValue) =>
                saveResponse(criterion.id, selectedValue)
              }
            >
              <SelectTrigger className="h-7 text-xs max-w-36">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {(criterion.options ?? []).map((option) => (
                  <SelectItem key={option} value={option} className="text-xs">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        case "text":
        default:
          return (
            <Textarea
              value={typeof value === "string" ? value : ""}
              onChange={(event) =>
                saveResponse(criterion.id, event.target.value)
              }
              placeholder="..."
              className="h-7 min-h-0 text-xs py-1 resize-none"
            />
          );
      }
    }

    switch (criterion.type) {
      case "checkbox":
        return (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant={value === "true" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs px-3"
              onClick={() => saveResponse(criterion.id, "true")}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={value === "false" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs px-3"
              onClick={() => saveResponse(criterion.id, "false")}
            >
              No
            </Button>
            <Button
              type="button"
              variant={value === "na" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs px-3 text-muted-foreground"
              onClick={() => saveResponse(criterion.id, "na")}
            >
              N/A
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => clearResponse(criterion.id)}
              aria-label={`Clear ${criterion.name}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      case "rating":
        return (
          <div className="flex flex-wrap items-center gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                type="button"
                variant={value === rating ? "default" : "outline"}
                size="icon"
                className="h-7 w-7"
                onClick={() => saveResponse(criterion.id, rating)}
                aria-label={`Rate ${criterion.name} ${rating} out of 5`}
              >
                <Star
                  className={
                    value === rating
                      ? "h-3.5 w-3.5 fill-current"
                      : "h-3.5 w-3.5"
                  }
                />
              </Button>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground"
              onClick={() => clearResponse(criterion.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      case "number":
        return (
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              value={typeof value === "number" ? value : ""}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue === "") {
                  clearResponse(criterion.id);
                  return;
                }
                saveResponse(criterion.id, Number(nextValue));
              }}
              className="h-7 w-24 text-xs"
              placeholder={
                criterion.name.toLowerCase().includes("commute")
                  ? "Minutes"
                  : ""
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              onClick={() => clearResponse(criterion.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      case "select":
        return (
          <div className="flex items-center gap-1.5">
            <Select
              value={typeof value === "string" ? value : ""}
              onValueChange={(selectedValue) =>
                saveResponse(criterion.id, selectedValue)
              }
            >
              <SelectTrigger className="h-7 text-xs max-w-40">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {(criterion.options ?? []).map((option) => (
                  <SelectItem key={option} value={option} className="text-xs">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              onClick={() => clearResponse(criterion.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      case "text":
      default:
        return (
          <div className="space-y-1.5">
            <Textarea
              value={typeof value === "string" ? value : ""}
              onChange={(event) =>
                saveResponse(criterion.id, event.target.value)
              }
              placeholder="Add notes..."
              className="min-h-14 text-xs"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground text-xs"
                onClick={() => clearResponse(criterion.id)}
              >
                Clear
              </Button>
            </div>
          </div>
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
              <span className="font-medium text-foreground">{score}</span>
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
              {criteria.filter((c) => hasResponse(responses[c.id])).length}/
              {criteria.length}
            </span>
          </div>

          <div className="space-y-1">
            {criteria.map((criterion) => {
              const answered = hasResponse(responses[criterion.id]);
              return (
                <div
                  key={criterion.id}
                  className="group flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-background/80"
                >
                  <div className="mt-0.5 shrink-0">
                    {answered ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-sm font-medium leading-snug">
                          {criterion.name}
                        </span>
                        {criterion.description && (
                          <span className="ml-1.5 text-xs text-muted-foreground/60">
                            {criterion.description}
                          </span>
                        )}
                      </div>
                      <div
                        className="shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {renderInput(criterion, true)}
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
