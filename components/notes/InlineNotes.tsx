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
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <div className="flex gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 text-muted-foreground/60 hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 text-muted-foreground/60 hover:text-foreground"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="text-sm">
          {notes ? (
            <BulletParser text={notes} />
          ) : (
            <p className="text-xs text-muted-foreground/50 italic">No notes</p>
          )}
        </div>
      )}
    </div>
  );
}
