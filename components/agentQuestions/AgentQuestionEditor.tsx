"use client";

import { useState } from "react";
import { AgentQuestionTemplate } from "@/types/agentQuestion";
import { useAgentQuestionStore } from "@/store/agentQuestionStore";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Question Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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

          <div className="space-y-1.5">
            <Label htmlFor="questions" className="text-xs font-medium text-muted-foreground">
              Questions (one per line)
            </Label>
            <Textarea
              id="questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Visitors: &#10;Dryer included: &#10;Aircon usage limitations:"
              className="min-h-[200px] text-sm resize-y"
            />
            <p className="text-xs text-muted-foreground/50">
              {questions.split("\n").filter((q) => q.trim()).length} question
              {questions.split("\n").filter((q) => q.trim()).length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
