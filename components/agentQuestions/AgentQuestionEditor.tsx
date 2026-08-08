"use client";

import { useState } from "react";
import { AgentQuestionTemplate } from "@/types/agentQuestion";
import { useAgentQuestionStore } from "@/store/agentQuestionStore";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AgentQuestionEditorProps {
  template: AgentQuestionTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentQuestionEditor({
  template,
  open,
  onOpenChange,
}: AgentQuestionEditorProps) {
  const t = useTranslations("agentQuestions");
  const tCommon = useTranslations("common");
  const [name, setName] = useState(template.name);
  const [questions, setQuestions] = useState(template.questions.join("\n"));
  const updateTemplate = useAgentQuestionStore((state) => state.updateTemplate);

  const handleSave = () => {
    const questionList = questions
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    updateTemplate(template.id, {
      name,
      questions: questionList,
      updated_at: new Date().toISOString(),
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setName(template.name);
    setQuestions(template.questions.join("\n"));
    onOpenChange(false);
  };

  const questionCount = questions.split("\n").filter((q) => q.trim()).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editor.editTemplate")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="template-name"
              className="text-xs font-medium text-muted-foreground"
            >
              {t("editor.nameLabel")}
            </Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("editor.namePlaceholder")}
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="questions"
              className="text-xs font-medium text-muted-foreground"
            >
              {t("editor.questionsLabel")}
            </Label>
            <Textarea
              id="questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder={t("editor.questionsPlaceholder")}
              className="min-h-[200px] text-sm resize-y"
            />
            <p className="text-xs text-muted-foreground/50">
              {t("editor.questionCount", { count: questionCount })}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              {tCommon("cancel")}
            </Button>
            <Button size="sm" onClick={handleSave}>
              {t("editor.saveChanges")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
