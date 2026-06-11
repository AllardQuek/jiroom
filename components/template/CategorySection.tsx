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
    </div>
  );
}
