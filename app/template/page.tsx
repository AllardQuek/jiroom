"use client";

import { useState, useEffect } from "react";
import { Template, Criterion } from "@/types/evaluation";
import { useTemplateStore } from "@/store/templateStore";
import { TemplateList } from "@/components/template/TemplateList";
import { TemplateEditor } from "@/components/template/TemplateEditor";
import { CriteriaForm } from "@/components/template/CriteriaForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteConfirmationDialog } from "@/components/listings/DeleteConfirmationDialog";
import {
  createCriterionSchema,
  CriterionFormData,
} from "@/lib/schemas/templateSchema";

export default function TemplatePage() {
  const initializeTemplates = useTemplateStore(
    (state) => state.initializeTemplates
  );
  const templates = useTemplateStore((state) => state.templates);
  const addTemplate = useTemplateStore((state) => state.addTemplate);
  const updateTemplate = useTemplateStore((state) => state.updateTemplate);
  const deleteTemplate = useTemplateStore((state) => state.deleteTemplate);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    null
  );
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(
    null
  );
  const [isCriteriaFormOpen, setIsCriteriaFormOpen] = useState(false);
  const [editingCriterionId, setEditingCriterionId] = useState<string | null>(
    null
  );
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);

  useEffect(() => {
    initializeTemplates();
  }, [initializeTemplates]);

  const editingTemplate = templates.find((t) => t.id === editingTemplateId);

  const handleCreateTemplate = () => {
    const newTemplate: Template = {
      id: crypto.randomUUID(),
      name: "New Template",
      criteria: [],
      updated_at: new Date().toISOString(),
    };
    addTemplate(newTemplate);
    setEditingTemplateId(newTemplate.id);
  };

  const handleDeleteTemplate = () => {
    if (deletingTemplateId) {
      deleteTemplate(deletingTemplateId);
      setDeletingTemplateId(null);
    }
  };

  const handleAddCriteria = (categoryId: string) => {
    setAddingToCategory(categoryId);
    setEditingCriterionId(null);
    setIsCriteriaFormOpen(true);
  };

  const handleEditCriteria = (criterionId: string) => {
    setEditingCriterionId(criterionId);
    setAddingToCategory(null);
    setIsCriteriaFormOpen(true);
  };

  const handleCriteriaSubmit = (data: CriterionFormData) => {
    if (!editingTemplate) return;

    const newCriterion: Criterion = {
      id: editingCriterionId || crypto.randomUUID(),
      ...data,
      description: data.description || "",
    };

    let updatedCriteria: Criterion[];

    if (editingCriterionId) {
      // Edit existing
      updatedCriteria = editingTemplate.criteria.map((c) =>
        c.id === editingCriterionId ? newCriterion : c
      );
    } else {
      // Add new
      updatedCriteria = [...editingTemplate.criteria, newCriterion];
    }

    updateTemplate(editingTemplate.id, {
      criteria: updatedCriteria,
      updated_at: new Date().toISOString(),
    });

    setIsCriteriaFormOpen(false);
    setEditingCriterionId(null);
    setAddingToCategory(null);
  };

  const handleDeleteCriteria = (criterionId: string) => {
    if (!editingTemplate) return;

    const updatedCriteria = editingTemplate.criteria.filter(
      (c) => c.id !== criterionId
    );
    updateTemplate(editingTemplate.id, {
      criteria: updatedCriteria,
      updated_at: new Date().toISOString(),
    });
  };

  const getCategories = () => {
    if (!editingTemplate) return [];
    const categories = new Set(editingTemplate.criteria.map((c) => c.category));
    return Array.from(categories);
  };

  const editingCriterion = editingTemplate?.criteria.find(
    (c) => c.id === editingCriterionId
  );

  return (
    <div className="p-4">
      <TemplateList
        onEdit={setEditingTemplateId}
        onCreate={handleCreateTemplate}
        onDelete={setDeletingTemplateId}
      />

      {editingTemplate && (
        <TemplateEditor
          template={editingTemplate}
          open={!!editingTemplateId}
          onOpenChange={(open) => !open && setEditingTemplateId(null)}
          onAddCriteria={handleAddCriteria}
          onEditCriteria={handleEditCriteria}
          onDeleteCriteria={handleDeleteCriteria}
        />
      )}

      {isCriteriaFormOpen && (
        <Dialog open={isCriteriaFormOpen} onOpenChange={setIsCriteriaFormOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCriterion ? "Edit Criteria" : "Add Criteria"}
              </DialogTitle>
            </DialogHeader>
            <CriteriaForm
              defaultValues={
                editingCriterion
                  ? {
                      name: editingCriterion.name,
                      description: editingCriterion.description,
                      type: editingCriterion.type,
                      category: editingCriterion.category,
                      options: editingCriterion.options,
                      scores: editingCriterion.scores,
                      thresholds: editingCriterion.thresholds,
                    }
                  : {
                      category: addingToCategory || "",
                    }
              }
              categories={getCategories()}
              onSubmit={handleCriteriaSubmit}
              onCancel={() => setIsCriteriaFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {deletingTemplateId && (
        <DeleteConfirmationDialog
          open={!!deletingTemplateId}
          onOpenChange={(open) => !open && setDeletingTemplateId(null)}
          onConfirm={handleDeleteTemplate}
          listingTitle={editingTemplate?.name || "Template"}
        />
      )}
    </div>
  );
}
