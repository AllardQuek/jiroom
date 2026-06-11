"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Edit2 } from "lucide-react";

interface VerdictReasoningProps {
  reasoning: string;
  onReasoningChange: (reasoning: string) => void;
}

export function VerdictReasoning({
  reasoning,
  onReasoningChange,
}: VerdictReasoningProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localReasoning, setLocalReasoning] = useState(reasoning);

  const handleSave = () => {
    onReasoningChange(localReasoning);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalReasoning(reasoning);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Label htmlFor="verdict-reasoning">Verdict Reasoning</Label>
        <Textarea
          id="verdict-reasoning"
          value={localReasoning}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setLocalReasoning(e.target.value)
          }
          placeholder="Add reasoning for your verdict..."
          rows={3}
          className="resize-none"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Verdict Reasoning</Label>
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>
      {reasoning ? (
        <p className="text-sm p-3 bg-muted rounded-lg">{reasoning}</p>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No reasoning added
        </p>
      )}
    </div>
  );
}
