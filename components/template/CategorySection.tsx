"use client";

import { Criterion } from "@/types/evaluation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CriteriaItem } from "./CriteriaItem";

interface CategorySectionProps {
  category: string;
  criteria: Criterion[];
  onAddCriteria: () => void;
  onEditCriteria: (criterionId: string) => void;
  onDeleteCriteria: (criterionId: string) => void;
  onMoveCriteria: (criterionId: string, direction: "up" | "down") => void;
}

export function CategorySection({
  category,
  criteria,
  onAddCriteria,
  onEditCriteria,
  onDeleteCriteria,
  onMoveCriteria,
}: CategorySectionProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{category}</h3>
        <Button size="sm" onClick={onAddCriteria}>
          <Plus className="w-4 h-4 mr-1" />
          Add Criteria
        </Button>
      </div>

      <div className="space-y-2">
        {criteria.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No criteria in this category
          </p>
        ) : (
          criteria.map((criterion, index) => (
            <CriteriaItem
              key={criterion.id}
              criterion={criterion}
              onEdit={() => onEditCriteria(criterion.id)}
              onDelete={() => onDeleteCriteria(criterion.id)}
              onMoveUp={
                index > 0 ? () => onMoveCriteria(criterion.id, "up") : undefined
              }
              onMoveDown={
                index < criteria.length - 1
                  ? () => onMoveCriteria(criterion.id, "down")
                  : undefined
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
