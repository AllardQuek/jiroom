"use client";

import { Criterion } from "@/types/evaluation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CriteriaItem } from "./CriteriaItem";

interface CategorySectionProps {
  category: string;
  criteria: Criterion[];
  templateId: string;
  onAddCriteria: () => void;
  onEditCriteria: (criterionId: string) => void;
  onDeleteCriteria: (criterionId: string) => void;
}

export function CategorySection({
  category,
  criteria,
  templateId,
  onAddCriteria,
  onEditCriteria,
  onDeleteCriteria,
}: CategorySectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">{category}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddCriteria}
          className="h-6 text-xs text-muted-foreground/60 hover:text-foreground"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>

      <div className="divide-y divide-border/30">
        {criteria.length === 0 ? (
          <p className="text-xs text-muted-foreground/40 py-3 text-center">
            No criteria in this category
          </p>
        ) : (
          criteria.map((criterion) => (
            <CriteriaItem
              key={criterion.id}
              criterion={criterion}
              templateId={templateId}
              onEdit={() => onEditCriteria(criterion.id)}
              onDelete={() => onDeleteCriteria(criterion.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}
