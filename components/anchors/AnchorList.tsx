"use client";

import { useAnchorStore } from "@/store/anchorStore";
import { ANCHOR_COLORS } from "@/lib/constants/ANCHOR_COLORS";
import { Anchor } from "@/types/anchor";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateAnchorForm } from "@/components/anchors/CreateAnchorForm";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function AnchorListPage() {
  const anchors = useAnchorStore((state) => state.anchors);
  const deleteAnchor = useAnchorStore((state) => state.deleteAnchor);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAnchor, setEditingAnchor] = useState<Anchor | null>(null);
  const [sortBy, setSortBy] = useState<"title" | "type">("title");

  const sorted = [...anchors].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return a.type.localeCompare(b.type);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-bold">Anchors</h1>
        <Button
          onClick={() => setShowCreateDialog(true)}
          size="sm"
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
        <span className="text-xs text-muted-foreground">Sort by:</span>
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
        <span className="text-xs text-muted-foreground ml-auto">
          {anchors.length} anchor{anchors.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sorted.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-sm">No anchors yet</p>
            <p className="text-xs mt-1">
              Add anchors from the map or from this page
            </p>
          </div>
        )}

        {sorted.map((anchor) => {
          const color = anchor.color || ANCHOR_COLORS[anchor.type];
          return (
            <div
              key={anchor.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
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
              <div className="flex items-center gap-1 shrink-0">
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
    </div>
  );
}
