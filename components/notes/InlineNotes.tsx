"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import { BulletParser } from "./BulletParser";
import { NotesEditor } from "./NotesEditor";

interface InlineNotesProps {
  notes: string;
  onUpdate: (notes: string) => void;
  updatedAt?: string;
  label?: string;
}

export function InlineNotes({
  notes,
  onUpdate,
  updatedAt,
  label = "Notes",
}: InlineNotesProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <NotesEditor
        value={notes}
        onChange={onUpdate}
        onSave={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
        updatedAt={updatedAt}
      />
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="text-sm">
          {notes ? (
            <BulletParser text={notes} />
          ) : (
            <p className="text-muted-foreground italic">No notes</p>
          )}
        </div>
      )}
    </div>
  );
}
