import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Edit2 } from "lucide-react";

interface ViewingNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function ViewingNotes({ notes, onNotesChange }: ViewingNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);

  const handleSave = () => {
    onNotesChange(localNotes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalNotes(notes);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Label htmlFor="viewing-notes">Viewing Notes</Label>
        <Textarea
          id="viewing-notes"
          value={localNotes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLocalNotes(e.target.value)}
          placeholder="Add notes about this viewing..."
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
        <Label>Viewing Notes</Label>
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>
      {notes ? (
        <p className="text-sm p-3 bg-muted rounded-lg">{notes}</p>
      ) : (
        <p className="text-sm text-muted-foreground italic">No notes added</p>
      )}
    </div>
  );
}
