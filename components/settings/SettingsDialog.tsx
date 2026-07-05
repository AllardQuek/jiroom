"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Template, Criterion } from "@/types/evaluation";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTemplateStore } from "@/store/templateStore";
import { useAgentQuestionStore } from "@/store/agentQuestionStore";
import { AgentQuestionTemplate } from "@/types/agentQuestion";
import { TemplateList } from "@/components/template/TemplateList";
import { TemplateEditor } from "@/components/template/TemplateEditor";
import { CriteriaForm } from "@/components/template/CriteriaForm";
import { DeleteConfirmationDialog } from "@/components/listings/DeleteConfirmationDialog";
import { CriterionFormData } from "@/lib/schemas/templateSchema";
import { AgentQuestionList } from "@/components/agentQuestions/AgentQuestionList";
import { AgentQuestionEditor } from "@/components/agentQuestions/AgentQuestionEditor";
import { TenantProfileForm } from "@/components/tenantProfile/TenantProfileForm";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const t = useTranslations("settings");
  const templates = useTemplateStore((state) => state.templates);
  const addTemplate = useTemplateStore((state) => state.addTemplate);
  const updateTemplate = useTemplateStore((state) => state.updateTemplate);
  const deleteTemplate = useTemplateStore((state) => state.deleteTemplate);

  const agentTemplates = useAgentQuestionStore((state) => state.templates);
  const addAgentTemplate = useAgentQuestionStore((state) => state.addTemplate);
  const updateAgentTemplate = useAgentQuestionStore(
    (state) => state.updateTemplate
  );
  const deleteAgentTemplate = useAgentQuestionStore(
    (state) => state.deleteTemplate
  );

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

  const [editingAgentTemplateId, setEditingAgentTemplateId] = useState<
    string | null
  >(null);
  const [deletingAgentTemplateId, setDeletingAgentTemplateId] = useState<
    string | null
  >(null);

  const editingTemplate = templates.find((t) => t.id === editingTemplateId);
  const editingAgentTemplate = agentTemplates.find(
    (t) => t.id === editingAgentTemplateId
  );

  const handleCreateTemplate = () => {
    const newTemplate: Template = {
      id: crypto.randomUUID(),
      name: "New Template",
      version: 1,
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

  const handleDeleteAgentTemplate = () => {
    if (deletingAgentTemplateId) {
      deleteAgentTemplate(deletingAgentTemplateId);
      setDeletingAgentTemplateId(null);
    }
  };

  const handleCreateAgentTemplate = () => {
    const newTemplate: AgentQuestionTemplate = {
      id: crypto.randomUUID(),
      name: "New Question Template",
      questions: [],
      updated_at: new Date().toISOString(),
    };
    addAgentTemplate(newTemplate);
    setEditingAgentTemplateId(newTemplate.id);
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
      updatedCriteria = editingTemplate.criteria.map((c) =>
        c.id === editingCriterionId ? newCriterion : c
      );
    } else {
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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingTemplateId(null);
      setEditingAgentTemplateId(null);
    }
    onOpenChange(open);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-base">{t("title")}</DialogTitle>
            <p className="text-xs text-muted-foreground/60">
              {t("manageDescription")}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Evaluation Templates Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  {t("evaluationTemplatesTitle")}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCreateTemplate}
                  className="h-7 text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {t("new")}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground/50">
                {t("evaluationTemplatesDescription")}
              </p>
              <TemplateList
                onEdit={setEditingTemplateId}
                onCreate={handleCreateTemplate}
                onDelete={setDeletingTemplateId}
              />
            </div>

            <div className="border-t border-border/80" />

            {/* Agent Questions Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  {t("agentQuestionsTitle")}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCreateAgentTemplate}
                  className="h-7 text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {t("new")}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground/50">
                {t("agentQuestionsDescription")}
              </p>
              <AgentQuestionList
                onEdit={setEditingAgentTemplateId}
                onCreate={handleCreateAgentTemplate}
                onDelete={setDeletingAgentTemplateId}
              />
            </div>

            <div className="border-t border-border/80" />

            {/* Tenant Profile Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                {t("tenantProfileTitle")}
              </h3>
              <p className="text-xs text-muted-foreground/50">
                {t("tenantProfileDescription")}
              </p>
              <TenantProfileForm />
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      {editingAgentTemplate && (
        <AgentQuestionEditor
          template={editingAgentTemplate}
          open={!!editingAgentTemplateId}
          onOpenChange={(open) => !open && setEditingAgentTemplateId(null)}
        />
      )}

      {isCriteriaFormOpen && (
        <Dialog open={isCriteriaFormOpen} onOpenChange={setIsCriteriaFormOpen}>
          <DialogContent className="max-w-md max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCriterion ? t("editCriteria") : t("addCriteria")}
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

      {deletingAgentTemplateId && (
        <DeleteConfirmationDialog
          open={!!deletingAgentTemplateId}
          onOpenChange={(open) => !open && setDeletingAgentTemplateId(null)}
          onConfirm={handleDeleteAgentTemplate}
          listingTitle={editingAgentTemplate?.name || "Template"}
        />
      )}
    </>
  );
}
