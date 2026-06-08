"use client";

import { Criterion } from "@/types/evaluation";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CriteriaItemProps {
  criterion: Criterion;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const typeLabels: Record<string, string> = {
  checkbox: "Checkbox",
  rating: "Rating",
  number: "Number",
  text: "Text",
  select: "Select",
};

const weightLabels: Record<number, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
};

export function CriteriaItem({
  criterion,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: CriteriaItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate">{criterion.name}</h4>
          <Badge variant="outline" className="text-xs">
            {typeLabels[criterion.type]}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            W: {weightLabels[criterion.weight]}
          </Badge>
        </div>
        {criterion.description && (
          <p className="text-sm text-muted-foreground truncate">
            {criterion.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        {onMoveUp && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            className="h-8 w-8"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        )}
        {onMoveDown && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            className="h-8 w-8"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
