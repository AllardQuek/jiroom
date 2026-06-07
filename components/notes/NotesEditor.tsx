import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";

interface NotesEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  updatedAt?: string;
}

export function NotesEditor({
  value,
  onChange,
  onSave,
  onCancel,
  updatedAt,
}: NotesEditorProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleSave = () => {
    onChange(localValue);
    onSave();
  };

  const formatTimestamp = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="notes">Notes</Label>
        {updatedAt && (
          <span className="text-xs text-muted-foreground">
            Updated {formatTimestamp(updatedAt)}
          </span>
        )}
      </div>
      <Textarea
        id="notes"
        value={localValue}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLocalValue(e.target.value)}
        placeholder="Add notes... Use '-' at the start of a line for bullet points"
        rows={4}
        className="resize-none"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
