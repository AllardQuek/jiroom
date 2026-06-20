"use client";

import { useState } from "react";
import { useAnchorStore } from "@/store/anchorStore";
import { ANCHOR_COLORS } from "@/lib/constants/ANCHOR_COLORS";
import { Anchor } from "@/types/anchor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateAnchorForm } from "@/components/anchors/CreateAnchorForm";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil, X, ChevronDown } from "lucide-react";

interface AnchorPanelProps {
  open: boolean;
  onClose: () => void;
  onAnchorSelect?: (anchor: Anchor) => void;
}

export default function AnchorPanel({
  open,
  onClose,
  onAnchorSelect,
}: AnchorPanelProps) {
  const anchors = useAnchorStore((state) => state.anchors);
  const deleteAnchor = useAnchorStore((state) => state.deleteAnchor);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAnchor, setEditingAnchor] = useState<Anchor | null>(null);
  const [sortBy, setSortBy] = useState<"title" | "type">("title");

  const sorted = [...anchors].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return a.type.localeCompare(b.type);
  });

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl border-t border-border shadow-[0_-4px_24px_var(--shadow-panel)] max-h-[60dvh] flex flex-col animate-slide-up sm:bottom-auto sm:left-auto sm:top-14 sm:right-4 sm:w-96 sm:max-h-[calc(100dvh-6rem)] sm:rounded-2xl sm:shadow-xl sm:animate-fade-in">
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 -ml-1 text-muted-foreground hover:text-foreground"
            >
              <ChevronDown size={20} />
            </button>
            <h2 className="text-base font-bold">Anchors</h2>
            <span className="text-xs text-muted-foreground">
              {anchors.length}
            </span>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            size="sm"
            className="gap-1 h-8"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30 shrink-0">
          <span className="text-xs text-muted-foreground">Sort:</span>
          <button
            onClick={() => setSortBy("title")}
            className={`text-xs px-2 py-0.5 rounded ${
              sortBy === "title"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Name
          </button>
          <button
            onClick={() => setSortBy("type")}
            className={`text-xs px-2 py-0.5 rounded ${
              sortBy === "type"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Type
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {sorted.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">No anchors yet</p>
              <p className="text-xs mt-1">Add anchors from the map search</p>
            </div>
          )}

          {sorted.map((anchor) => {
            const color = anchor.color || ANCHOR_COLORS[anchor.type];
            return (
              <div
                key={anchor.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onAnchorSelect?.(anchor)}
              >
                <div
                  className="w-3 h-3 rotate-45 shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{anchor.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: color + "20",
                        color: color,
                      }}
                    >
                      {anchor.type.replace("_", " ")}
                    </span>
                    {anchor.address && (
                      <span className="text-xs text-muted-foreground truncate">
                        {anchor.address}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setEditingAnchor(anchor)}
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteAnchor(anchor.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        open={showCreateDialog || editingAnchor !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingAnchor(null);
          }
        }}
      >
        <DialogContent className="max-w-md max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAnchor ? "Edit Anchor" : "Add Anchor"}
            </DialogTitle>
          </DialogHeader>
          <CreateAnchorForm
            anchorToEdit={editingAnchor || undefined}
            onSuccess={() => {
              setShowCreateDialog(false);
              setEditingAnchor(null);
            }}
            onCancel={() => {
              setShowCreateDialog(false);
              setEditingAnchor(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
