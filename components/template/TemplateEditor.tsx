"use client";

import { useState } from "react";
import { Template } from "@/types/evaluation";
import { useTemplateStore } from "@/store/templateStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySection } from "./CategorySection";
import { CriteriaForm } from "./CriteriaForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TemplateEditorProps {
  template: Template;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCriteria: (categoryId: string) => void;
  onEditCriteria: (criterionId: string) => void;
  onDeleteCriteria: (criterionId: string) => void;
  onMoveCriteria: (criterionId: string, direction: "up" | "down") => void;
}

export function TemplateEditor({
  template,
  open,
  onOpenChange,
  onAddCriteria,
  onEditCriteria,
  onDeleteCriteria,
  onMoveCriteria,
}: TemplateEditorProps) {
  const [name, setName] = useState(template.name);
  const updateTemplate = useTemplateStore((state) => state.updateTemplate);

  const handleSave = () => {
    updateTemplate(template.id, {
      name,
      updated_at: new Date().toISOString(),
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setName(template.name);
    onOpenChange(false);
  };

  // Group criteria by category
  const groupedCriteria = template.criteria.reduce(
    (acc, criterion) => {
      if (!acc[criterion.category]) {
        acc[criterion.category] = [];
      }
      acc[criterion.category].push(criterion);
      return acc;
    },
    {} as Record<string, typeof template.criteria>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template name"
            />
          </div>

          <div className="space-y-4">
            {Object.entries(groupedCriteria).map(([category, criteria]) => (
              <CategorySection
                key={category}
                category={category}
                criteria={criteria}
                onAddCriteria={() => onAddCriteria(category)}
                onEditCriteria={onEditCriteria}
                onDeleteCriteria={onDeleteCriteria}
                onMoveCriteria={onMoveCriteria}
              />
            ))}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
