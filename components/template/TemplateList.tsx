"use client";

import { useTemplateStore } from "@/store/templateStore";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, FileText } from "lucide-react";

interface TemplateListProps {
  onEdit: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function TemplateList({
  onEdit,
  onCreate,
  onDelete,
}: TemplateListProps) {
  const templates = useTemplateStore((state) => state.templates);

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="rounded-full bg-muted/50 p-3">
          <FileText size={20} className="text-muted-foreground/50" />
        </div>
        <div>
          <p className="text-sm font-medium">No templates</p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            Create one to start scoring listings
          </p>
        </div>
        <Button size="sm" onClick={onCreate}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Template
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {templates.map((template) => (
        <div
          key={template.id}
          className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background">
              <FileText size={14} className="text-muted-foreground/60" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{template.name}</p>
              <p className="text-xs text-muted-foreground/50">
                {template.criteria.length} {template.criteria.length === 1 ? "criterion" : "criteria"}
              </p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(template.id)}
              className="h-7 w-7"
            >
              <Pencil size={12} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(template.id)}
              className="h-7 w-7 text-muted-foreground/50 hover:text-destructive"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
