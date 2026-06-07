"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Columns3, LayoutGrid, Plus } from "lucide-react";
import { ListingList } from "@/components/listings/ListingList";
import { CreateListingForm } from "@/components/listings/CreateListingForm";
import { useComparisonStore } from "@/store/comparisonStore";

export default function ListingsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "board">("grid");
  const router = useRouter();
  const selectedListingIds = useComparisonStore(
    (state) => state.selectedListingIds
  );

  const handleCompare = () => {
    router.push("/compare");
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Listings</h1>
          <p className="text-sm text-muted-foreground">
            Track each room from first save to final decision.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-md border bg-background p-1">
            <Button
              type="button"
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </Button>
            <Button
              type="button"
              variant={viewMode === "board" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("board")}
              className="gap-2"
            >
              <Columns3 className="h-4 w-4" />
              Board
            </Button>
          </div>
          {selectedListingIds.length >= 2 && (
            <Button variant="outline" onClick={handleCompare}>
              Compare ({selectedListingIds.length})
            </Button>
          )}
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add listing
          </Button>
        </div>
      </div>

      <ListingList viewMode={viewMode} />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Listing</DialogTitle>
          </DialogHeader>
          <CreateListingForm
            onSuccess={() => setIsCreateDialogOpen(false)}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
