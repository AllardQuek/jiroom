"use client";

import { useState, useRef, useEffect } from "react";
import { Criterion } from "@/types/evaluation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  Trash2,
  CheckSquare,
  Star,
  Hash,
  Type,
  List,
  FunctionSquare,
  Gauge,
  Plus,
  X,
} from "lucide-react";
import { useTemplateStore } from "@/store/templateStore";

interface CriteriaItemProps {
  criterion: Criterion;
  templateId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const typeMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  checkbox: { label: "Checkbox", icon: <CheckSquare className="h-3 w-3" /> },
  rating: { label: "Rating", icon: <Star className="h-3 w-3" /> },
  number: { label: "Number", icon: <Hash className="h-3 w-3" /> },
  text: { label: "Text", icon: <Type className="h-3 w-3" /> },
  select: { label: "Select", icon: <List className="h-3 w-3" /> },
  derived: { label: "Derived", icon: <FunctionSquare className="h-3 w-3" /> },
};

function ScoreToggle({ value, onChange }: {
  value: -1 | 0 | 1;
  onChange: (v: -1 | 0 | 1) => void;
}) {
  return (
    <div className="flex rounded-md border border-border/40 overflow-hidden bg-background">
      {([1, 0, -1] as const).map((v) => {
        const label = v > 0 ? "+1" : String(v);
        const textColor =
          v === 1
            ? "text-emerald-600 dark:text-emerald-400"
            : v === -1
              ? "text-red-500 dark:text-red-400"
              : "text-muted-foreground";
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`h-6 px-2 text-[11px] leading-none transition-colors ${
              value === v
                ? `bg-foreground/10 font-semibold ${textColor}`
                : "text-muted-foreground/40 hover:text-muted-foreground/70 hover:bg-muted/40"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ScorePopover({
  criterion,
  templateId,
  open,
  onClose,
}: {
  criterion: Criterion;
  templateId: string;
  open: boolean;
  onClose: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const updateTemplate = useTemplateStore((s) => s.updateTemplate);
  const templates = useTemplateStore((s) => s.templates);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escHandler);
    };
  }, [open, onClose]);

  if (!open) return null;

  const updateCriterion = (patch: Partial<Criterion>) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    updateTemplate(templateId, {
      criteria: template.criteria.map((c) =>
        c.id === criterion.id ? { ...c, ...patch } : c
      ),
    });
  };

  const setScore = (option: string, score: -1 | 0 | 1) => {
    updateCriterion({
      scores: { ...criterion.scores, [option]: score },
    });
  };

  const updateThreshold = (
    index: number,
    patch: Partial<{ min?: number; max?: number; score: -1 | 0 | 1 }>
  ) => {
    const updated = [...(criterion.thresholds ?? [])];
    updated[index] = { ...updated[index], ...patch };
    updateCriterion({ thresholds: updated });
  };

  const addThreshold = () => {
    updateCriterion({
      thresholds: [...(criterion.thresholds ?? []), { score: 0 }],
    });
  };

  const removeThreshold = (index: number) => {
    const updated = [...(criterion.thresholds ?? [])];
    updated.splice(index, 1);
    updateCriterion({ thresholds: updated });
  };

  return (
    <div
      ref={popoverRef}
      className="absolute top-full right-0 mt-1 z-50 w-72 rounded-lg border border-border/50 bg-popover text-popover-foreground shadow-lg p-3 animate-in"
      style={{ animation: "fadeIn 0.1s ease-out" }}
    >
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          Scoring
        </span>
        <button
          type="button"
          onClick={onClose}
          className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground/40 hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {(criterion.type === "select" || criterion.scores) && (
        <div className="space-y-1.5">
          {(criterion.options ?? []).map((option) => (
            <div
              key={option}
              className="flex items-center justify-between gap-2 py-1"
            >
              <span className="text-xs text-foreground/80 truncate">
                {option}
              </span>
              <ScoreToggle
                value={(criterion.scores?.[option] ?? 0) as -1 | 0 | 1}
                onChange={(v) => setScore(option, v)}
              />
            </div>
          ))}
        </div>
      )}

      {(criterion.type === "number" || criterion.type === "derived") && (
        <div className="space-y-1.5">
          {(criterion.thresholds ?? []).map((t, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Input
                type="number"
                placeholder="Min"
                value={t.min ?? ""}
                onChange={(e) =>
                  updateThreshold(i, {
                    min: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
                className="h-7 w-14 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-xs text-muted-foreground/40">&ndash;</span>
              <Input
                type="number"
                placeholder="Max"
                value={t.max ?? ""}
                onChange={(e) =>
                  updateThreshold(i, {
                    max: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
                className="h-7 w-14 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <ScoreToggle
                value={t.score}
                onChange={(v) => updateThreshold(i, { score: v })}
              />
              <button
                type="button"
                onClick={() => removeThreshold(i)}
                className="h-6 w-6 shrink-0 flex items-center justify-center text-muted-foreground/30 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addThreshold}
            className="flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-foreground mt-1"
          >
            <Plus className="h-3 w-3" />
            Add range
          </button>
        </div>
      )}

      {(criterion.type === "checkbox" || criterion.type === "rating") && (
        <p className="text-xs text-muted-foreground/50">
          {criterion.type === "checkbox"
            ? "Yes = +1, No = -1, N/A = excluded"
            : "1&ndash;2 = -1, 3 = 0, 4&ndash;5 = +1"}
        </p>
      )}
    </div>
  );
}

export function CriteriaItem({
  criterion,
  templateId,
  onEdit,
  onDelete,
}: CriteriaItemProps) {
  const hasScores =
    criterion.scores && Object.keys(criterion.scores).length > 0;
  const hasThresholds =
    criterion.thresholds && criterion.thresholds.length > 0;
  const hasScoring = hasScores || hasThresholds;
  const meta = typeMeta[criterion.type] ?? typeMeta.text;
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg group relative">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate text-sm">{criterion.name}</h4>
          <Badge
            variant="outline"
            className="inline-flex items-center gap-1 text-[10px] px-2 py-0 font-normal text-muted-foreground/60 border-border/40"
          >
            {meta.icon}
            {meta.label}
          </Badge>
          {hasScoring && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPopoverOpen(true);
              }}
              className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground/40 hover:text-foreground hover:bg-muted-foreground/10 transition-colors"
              title="Scoring details"
            >
              <Gauge className="h-3 w-3" />
            </button>
          )}
        </div>
        {criterion.description && (
          <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-1">
            {criterion.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-7 w-7 text-muted-foreground/60 hover:text-foreground"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-7 w-7 text-muted-foreground/60 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScorePopover
        criterion={criterion}
        templateId={templateId}
        open={popoverOpen}
        onClose={() => setPopoverOpen(false)}
      />
    </div>
  );
}
