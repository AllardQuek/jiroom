"use client";

import { useState } from "react";
import { Template } from "@/types/evaluation";
import { useTemplateStore } from "@/store/templateStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySection } from "./CategorySection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TemplateEditorProps {
  template: Template;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCriteria: (categoryId: string) => void;
  onEditCriteria: (criterionId: string) => void;
  onDeleteCriteria: (criterionId: string) => void;
}

export function TemplateEditor({
  template,
  open,
  onOpenChange,
  onAddCriteria,
  onEditCriteria,
  onDeleteCriteria,
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
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="template-name" className="text-xs font-medium text-muted-foreground">
              Name
            </Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template name"
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-3">
            {Object.entries(groupedCriteria).map(([category, criteria]) => (
              <CategorySection
                key={category}
                category={category}
                criteria={criteria}
                templateId={template.id}
                onAddCriteria={() => onAddCriteria(category)}
                onEditCriteria={onEditCriteria}
                onDeleteCriteria={onDeleteCriteria}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddCriteria("General")}
              className="text-xs text-muted-foreground"
            >
              + Add criteria
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
