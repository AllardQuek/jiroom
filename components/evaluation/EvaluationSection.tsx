"use client";

import { useEffect } from "react";
import { Check, Circle, Star, Trash2, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Set up an evaluation template before rating this listing.
          </p>
        </CardContent>
      </Card>
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
      const responsesWithUpdate = {
        ...evaluation.responses,
        [criterionId]: value,
      };

      updateEvaluation(evaluation.id, {
        responses: responsesWithUpdate,
        updated_at: now,
      });
      return;
    }

    const newEvaluation: Evaluation = {
      id: crypto.randomUUID(),
      listing_id: listingId,
      template_id: template.id,
      responses: {
        [criterionId]: value,
      },
      created_at: now,
      updated_at: now,
    };

    addEvaluation(newEvaluation);
  };

  const clearResponse = (criterionId: string) => {
    if (!evaluation) {
      return;
    }

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

  const renderInput = (criterion: Criterion) => {
    const value = responses[criterion.id];

    switch (criterion.type) {
      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={value === "true" ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => saveResponse(criterion.id, "true")}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={value === "false" ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => saveResponse(criterion.id, "false")}
            >
              No
            </Button>
            <Button
              type="button"
              variant={value === "na" ? "default" : "ghost"}
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => saveResponse(criterion.id, "na")}
            >
              N/A
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => clearResponse(criterion.id)}
              aria-label={`Clear ${criterion.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      case "rating":
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                type="button"
                variant={value === rating ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => saveResponse(criterion.id, rating)}
                aria-label={`Rate ${criterion.name} ${rating} out of 5`}
              >
                <Star
                  className={
                    value === rating ? "h-4 w-4 fill-current" : "h-4 w-4"
                  }
                />
              </Button>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-2 px-2 text-muted-foreground"
              onClick={() => clearResponse(criterion.id)}
            >
              <Minus className="h-4 w-4" />
              Clear
            </Button>
          </div>
        );
      case "number":
        return (
          <div className="flex items-center gap-2">
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
              className="max-w-40"
              placeholder={
                criterion.name.toLowerCase().includes("commute")
                  ? "Minutes"
                  : ""
              }
            />
            {criterion.name.toLowerCase().includes("commute") && (
              <Badge variant="secondary" className="h-8 px-2">
                min
              </Badge>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-2 px-2 text-muted-foreground"
              onClick={() => clearResponse(criterion.id)}
            >
              Clear
            </Button>
          </div>
        );
      case "select":
        return (
          <div className="flex items-center gap-2">
            <Select
              value={typeof value === "string" ? value : ""}
              onValueChange={(selectedValue) =>
                saveResponse(criterion.id, selectedValue)
              }
            >
              <SelectTrigger className="max-w-56">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {(criterion.options ?? []).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-2 px-2 text-muted-foreground"
              onClick={() => clearResponse(criterion.id)}
            >
              Clear
            </Button>
          </div>
        );
      case "text":
      default:
        return (
          <div className="space-y-2">
            <Textarea
              value={typeof value === "string" ? value : ""}
              onChange={(event) =>
                saveResponse(criterion.id, event.target.value)
              }
              placeholder="Add notes"
              className="min-h-20"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-2 px-2 text-muted-foreground"
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
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-lg">Evaluation</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {template.name}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {answeredCount}/{totalCount} answered
            </Badge>
            <Badge
              variant={completionPercent === 100 ? "default" : "secondary"}
            >
              {completionPercent}%
            </Badge>
            {score !== null && (
              <Badge variant="outline">Score {score}/100</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedCriteria).map(([category, criteria]) => (
          <section
            key={category}
            className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h3 className="text-sm font-bold">{category}</h3>
              <span className="text-xs text-muted-foreground">
                {
                  criteria.filter((criterion) =>
                    hasResponse(responses[criterion.id])
                  ).length
                }
                /{criteria.length}
              </span>
            </div>

            <div className="space-y-4">
              {criteria.map((criterion) => {
                const answered = hasResponse(responses[criterion.id]);

                return (
                  <div
                    key={criterion.id}
                    className="grid gap-4 rounded-xl border border-border/60 bg-background p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  >
                    <div className="min-w-0">
                      <div className="flex items-start gap-2">
                        {answered ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                        ) : (
                          <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium">{criterion.name}</p>
                          {criterion.description && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {criterion.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>{renderInput(criterion)}</div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </CardContent>
    </Card>
  );
}
