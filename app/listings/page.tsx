"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ListingList } from "@/components/listings/ListingList";
import { CreateListingForm } from "@/components/listings/CreateListingForm";
import { useComparisonStore } from "@/store/comparisonStore";

export default function ListingsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();
  const selectedListingIds = useComparisonStore((state) => state.selectedListingIds);

  const handleCompare = () => {
    router.push("/compare");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listings</h1>
        <div className="flex gap-2">
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

      <ListingList />

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
