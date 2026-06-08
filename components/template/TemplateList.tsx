"use client";

import { useTemplateStore } from "@/store/templateStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

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
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No templates yet</p>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Templates</h2>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {template.criteria.length} criteria
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(template.id)}
                  className="flex-1"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(template.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
