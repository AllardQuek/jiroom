"use client";

import { useAgentQuestionStore } from "@/store/agentQuestionStore";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, FileText, Check } from "lucide-react";

interface AgentQuestionListProps {
  onEdit: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function AgentQuestionList({
  onEdit,
  onCreate,
  onDelete,
}: AgentQuestionListProps) {
  const t = useTranslations("agentQuestions");
  const templates = useAgentQuestionStore((state) => state.templates);
  const activeTemplateId = useAgentQuestionStore(
    (state) => state.activeTemplateId
  );
  const setActiveTemplate = useAgentQuestionStore(
    (state) => state.setActiveTemplate
  );

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="rounded-full bg-muted/50 p-3">
          <FileText size={20} className="text-muted-foreground/50" />
        </div>
        <div>
          <p className="text-sm font-medium">{t("list.noTemplates")}</p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            {t("list.noTemplatesHint")}
          </p>
        </div>
        <Button size="sm" onClick={onCreate}>
          <Plus className="w-4 h-4 mr-1.5" />
          {t("list.createTemplate")}
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
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{template.name}</p>
                {template.id === activeTemplateId && (
                  <Check size={12} className="text-primary shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground/50">
                {t("list.questionCount", { count: template.questions.length })}
              </p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {template.id !== activeTemplateId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTemplate(template.id)}
                className="h-7 w-7"
                title={t("list.setAsActive")}
              >
                <Check size={12} />
              </Button>
            )}
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
