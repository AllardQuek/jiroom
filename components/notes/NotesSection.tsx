"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { InlineNotes } from "./InlineNotes";

interface NoteSource {
  label: string;
  notes: string;
  updatedAt?: string;
  onUpdate: (notes: string) => void;
}

interface NotesSectionProps {
  sources: NoteSource[];
}

export function NotesSection({ sources }: NotesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasNotes = sources.some((source) => source.notes);

  if (!hasNotes) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">All Notes</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          {sources.map((source, index) => {
            if (!source.notes) return null;
            return (
              <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                <InlineNotes
                  notes={source.notes}
                  onUpdate={source.onUpdate}
                  updatedAt={source.updatedAt}
                  label={source.label}
                />
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}
